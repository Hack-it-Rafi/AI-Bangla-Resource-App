from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.translation import translate_english_to_bangla

# Router instance
router = APIRouter()

# Request schema
class TranslationRequest(BaseModel):
    english_text: str

# Response schema (optional for clarity)
class TranslationResponse(BaseModel):
    translated_text: str

@router.post("/translate/", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """
    Translates the text to Bangla.

    Args:
        request (TranslationRequest): The input text.

    Returns:
        TranslationResponse: The translated Bangla text.
    """
    try:
        translated_text = translate_english_to_bangla(request.english_text)
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
