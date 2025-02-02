from fastapi import FastAPI
from app.api.endpoints import router as translation_router
from app.api.training import training_router as training_router

# Initialize FastAPI app
app = FastAPI(title="Any language to Bangla Translator and TTS Service")

# Include API routers
app.include_router(translation_router, prefix="/api/v1")
app.include_router(training_router, prefix="/api/v1/training")
