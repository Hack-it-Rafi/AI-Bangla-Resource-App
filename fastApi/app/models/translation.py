from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
import torch

# Load the pre-trained model and tokenizer
model_name = "shhossain/opus-mt-en-to-bn"
tokenizer = MBart50TokenizerFast.from_pretrained(model_name)
model = MBartForConditionalGeneration.from_pretrained(model_name)

# Move model to GPU if available
if torch.cuda.is_available():
    model = model.cuda()

def translate_english_to_bangla(english_input: str) -> str:
    """
    Translates the text to Bangla using the Hugging Face model.

    Args:
        english_input (str): The input text.

    Returns:
        str: The translated Bangla text.
    """
    inputs = tokenizer(english_input, return_tensors="pt", padding=True, truncation=True, max_length=128)
    if torch.cuda.is_available():
        inputs = {key: value.cuda() for key, value in inputs.items()}

    translated_tokens = model.generate(**inputs, decoder_start_token_id=tokenizer.lang_code_to_id["bn_IN"])
    translated_text = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

    return translated_text

