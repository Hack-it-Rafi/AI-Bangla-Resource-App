from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
import torch

# Load the pre-trained model and tokenizer
model_name = "Mdkaif2782/banglish-to-bangla"
tokenizer = MBart50TokenizerFast.from_pretrained(model_name)
model = MBartForConditionalGeneration.from_pretrained(model_name)

# Move model to GPU if available
if torch.cuda.is_available():
    model = model.cuda()

def translate_banglish_to_bangla(banglish_input: str) -> str:
    """
    Translates Banglish text to Bangla using the Hugging Face model.

    Args:
        banglish_input (str): The Banglish input text.

    Returns:
        str: The translated Bangla text.
    """
    inputs = tokenizer(banglish_input, return_tensors="pt", padding=True, truncation=True, max_length=128)
    if torch.cuda.is_available():
        inputs = {key: value.cuda() for key, value in inputs.items()}

    translated_tokens = model.generate(**inputs, decoder_start_token_id=tokenizer.lang_code_to_id["bn_IN"])
    translated_text = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

    return translated_text

