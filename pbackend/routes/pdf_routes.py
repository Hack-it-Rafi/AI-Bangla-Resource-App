import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.text_extractor import extract_text_from_pdf
from models.translator import translate_text
from database.db import files_collection
from config import UPLOAD_FOLDER

pdf_routes = Blueprint("pdf_routes", __name__)
PDF_UPLOAD_PATH = os.path.join(UPLOAD_FOLDER, "pdf")

@pdf_routes.route("/upload/pdf", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(PDF_UPLOAD_PATH, filename)
    file.save(file_path)

    # Extract text and translate
    text = extract_text_from_pdf(file_path)
    translated_text = translate_text(text)

    # Save translated file
    translated_file_path = file_path.replace(".pdf", "_translated.txt")
    with open(translated_file_path, "w", encoding="utf-8") as f:
        f.write(translated_text)

    # Save to database
    file_data = {
        "filename": filename,
        "file_path": file_path,
        "translated_file": translated_file_path,
        "type": "pdf"
    }
    files_collection.insert_one(file_data)

    return jsonify({"message": "PDF uploaded and translated successfully", "translated_file": translated_file_path})
