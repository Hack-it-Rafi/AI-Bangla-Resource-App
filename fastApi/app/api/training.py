from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, TrainingArguments, Trainer
from torch.utils.data import Dataset
from apscheduler.schedulers.background import BackgroundScheduler
import os
import logging

# Router for training endpoints
training_router = APIRouter()
os.makedirs("app/training/saved_model", exist_ok=True)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Data Processor
class TranslationDataset(Dataset):
    def __init__(self, csv_path, tokenizer, max_length=128):
        self.data = pd.read_csv(csv_path)
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        source_text = self.data.iloc[idx]['banglish']
        target_text = self.data.iloc[idx]['bangla']
        inputs = self.tokenizer(source_text, truncation=True, max_length=self.max_length, padding='max_length', return_tensors="pt")
        labels = self.tokenizer(target_text, truncation=True, max_length=self.max_length, padding='max_length', return_tensors="pt").input_ids
        return {"input_ids": inputs.input_ids.squeeze(0), "attention_mask": inputs.attention_mask.squeeze(0), "labels": labels.squeeze(0)}

# Model Trainer
def fine_tune_model(csv_path, model_name="t5-small", save_path="app/training/saved_model"):
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

        dataset = TranslationDataset(csv_path, tokenizer)

        training_args = TrainingArguments(
            output_dir=save_path,
            per_device_train_batch_size=4,  # Reduce batch size for lightweight training
            num_train_epochs=3,
            save_steps=10,
            save_total_limit=2,
            logging_dir=f"{save_path}/logs",
            logging_steps=5,
        )

        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=dataset
        )

        trainer.train()
        model.save_pretrained(save_path)
        tokenizer.save_pretrained(save_path)
    except Exception as e:
        logger.error(f"Model fine-tuning failed: {e}")
        raise

# Scheduler
def schedule_training():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        lambda: fine_tune_model(csv_path="app/training/combined_data.csv"),
        trigger="interval",
        days=1
    )
    scheduler.start()

# API Endpoints
@training_router.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...)):
    file_location = f"app/training/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Merge uploaded file into combined_data.csv
    uploaded_df = pd.read_csv(file_location)
    combined_csv = "app/training/combined_data.csv"
    if os.path.exists(combined_csv):
        existing_df = pd.read_csv(combined_csv)
        final_df = pd.concat([existing_df, uploaded_df], ignore_index=True)
    else:
        final_df = uploaded_df

    final_df.to_csv(combined_csv, index=False)
    return {"status": "File uploaded and combined successfully"}

@training_router.post("/train/")
async def train_model():
    try:
        # Path to the combined training data
        csv_path = "app/training/combined_data.csv"
        if not os.path.exists(csv_path):
            raise HTTPException(status_code=400, detail="Training data not found.")

        # Trigger the fine-tuning process
        fine_tune_model(csv_path=csv_path)
        return {"status": "Training completed successfully"}
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Schedule training on app initialization
schedule_training()
