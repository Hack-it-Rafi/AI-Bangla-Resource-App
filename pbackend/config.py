from pymongo import MongoClient
import os

MONGO_URI = "mongodb+srv://Rafi_Abir:B4hIKH3naTkrjLsi@cluster0.xyjw3s8.mongodb.net/BitFest-Practise?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "translationDB"
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

