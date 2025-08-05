from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allow requests from React

# Path to your change point CSV
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "multi_change_points.csv")
# Or: CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "single_change_point.csv")

@app.route("/change-points", methods=["GET"])
def get_change_points():
    if not os.path.exists(CSV_PATH):
        return jsonify({"error": "Data file not found"}), 404
    
    df = pd.read_csv(CSV_PATH)
    return df.to_dict(orient="records")

if __name__ == "__main__":
    app.run(debug=True)
