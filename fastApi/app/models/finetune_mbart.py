from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load the model
model = AutoModelForSeq2SeqLM.from_pretrained(path_to_model_directory, local_files_only=True)

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(path_to_model_directory, local_files_only=True)

# Example inference
# text = "আমি ভাত খেতে চাই"
inputs = tokenizer(text, return_tensors="pt")
outputs = model.generate(**inputs)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))

# Quantitative Evaluation
import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("../training/combined_data.txt", sep="\t", names=["Text", "Gloss"])
df.dropna(inplace=True)

train_df, test_df = train_test_split(df, test_size=0.1, random_state=103)
test_df

# ----------------------------------------
import numpy as np
from sacrebleu.metrics import BLEU
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
import warnings
warnings.filterwarnings('ignore')

def calculate_metrics(predictions, references):
    """
    Calculate translation metrics including sacreBLEU and BLEU-1,2,3,4.
    
    Args:
        predictions: List of predicted translations
        references: List of reference translations
    
    Returns:
        Dictionary containing all metrics
    """
    metrics = {}
    
    # Prepare references for sacreBLEU (needs list of lists)
    refs_for_sacre = [[ref] for ref in references]
    
    # Calculate sacreBLEU
    sacrebleu = BLEU()
    bleu_score = sacrebleu.corpus_score(predictions, refs_for_sacre)
    metrics['sacreBLEU'] = bleu_score.score
    
    # Calculate BLEU-1,2,3,4 using NLTK
    smoother = SmoothingFunction().method1
    bleu_scores = {f'BLEU-{i}': [] for i in range(1, 5)}
    
    for pred, ref in zip(predictions, references):
        # Tokenize
        pred_tokens = pred.split()
        ref_tokens = ref.split()
        
        # Calculate BLEU-1,2,3,4
        for n in range(1, 5):
            score = sentence_bleu([ref_tokens], pred_tokens,
                                weights=tuple([1/n] * n + [0] * (4-n)),
                                smoothing_function=smoother)
            bleu_scores[f'BLEU-{n}'].append(score)
    
    # Average BLEU scores
    for k, v in bleu_scores.items():
        metrics[k] = np.mean(v) * 100
    
    return metrics

def print_metrics(metrics):
    """Pretty print the metrics"""
    print("\nTranslation Metrics:")
    print("-" * 40)
    for metric, value in metrics.items():
        if value is not None:
            print(f"{metric:.<30} {value:.2f}")
        else:
            print(f"{metric:.<30} Failed to calculate")
    print("-" * 40)


# ----------------------------------------
from tqdm import tqdm
import torch

# Parameters
batch_size = 32  # Adjust this based on GPU memory
predictions = []
references = test_df["Gloss"].values.tolist()

# Texts to predict
texts = test_df["Text"].values.tolist()

# Batched prediction
for i in tqdm(range(0, len(texts), batch_size), desc="Processing batches"):
    batch_texts = texts[i:i + batch_size]
    
    # Tokenize batch
    inputs = tokenizer(batch_texts, return_tensors="pt", padding=True, truncation=True).to("cuda" if torch.cuda.is_available() else "cpu")
    
    # Generate predictions for the batch
    with torch.no_grad():  # Disable gradient calculation for faster inference
        outputs = model.generate(**inputs)
    
    # Decode predictions and append to the list
    batch_predictions = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
    predictions.extend(batch_predictions)

# Check some references and predictions
print("References:", references[10:20])
print("Predictions:", predictions[10:20])


# ----------------------------------------

# Calculate metrics in batches to avoid memory issues
batch_size = 1000
metrics_list = []

for i in range(0, len(predictions), batch_size):
    batch_preds = predictions[i:i + batch_size]
    batch_refs = references[i:i + batch_size]
    
    batch_metrics = calculate_metrics(batch_preds, batch_refs)
    metrics_list.append(batch_metrics)


# Average metrics across batches
final_metrics = {}
for key in metrics_list[0].keys():
    values = [m[key] for m in metrics_list if m[key] is not None]
    if values:
        final_metrics[key] = np.mean(values)
    else:
        final_metrics[key] = None

# Print final results
print_metrics(final_metrics)