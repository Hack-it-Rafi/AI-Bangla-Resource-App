from deep_translator import GoogleTranslator

def translate_text(text, target_lang="bn"):
    translator = GoogleTranslator(source="auto", target=target_lang)
    return translator.translate(text)
