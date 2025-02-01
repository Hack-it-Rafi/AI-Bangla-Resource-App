from flask import Flask
from routes.pdf_routes import pdf_routes
from routes.txt_routes import txt_routes
import os
from config import UPLOAD_FOLDER

app = Flask(__name__)

# Ensure upload directories exist
os.makedirs(os.path.join(UPLOAD_FOLDER, "pdf"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, "txt"), exist_ok=True)

app.register_blueprint(pdf_routes)
app.register_blueprint(txt_routes)

if __name__ == "__main__":
    app.run(debug=True)
