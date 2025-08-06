# dashboard/backend/app.py
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

# Root data directory (adjust if your structure differs)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")

# Filenames (ensure these match your saved CSV names)
FILES = {
    "prices": "brent_oil_log_returns.csv",
    "events": "oil_market_event.csv",
    "single_cp": "single_change_point.csv",
    "multi_cp": "multi_change_points.csv"
}

def load_csv(filename, parse_dates=["date"]):
    path = os.path.join(DATA_DIR, filename)
    logger.info(f"Loading file: {path}")
    if not os.path.exists(path):
        logger.error(f"File not found: {path}")
        return None, f"File not found: {path}"
    try:
        df = pd.read_csv(path)
        if "date" in [c.lower() for c in df.columns]:
            date_col = next(c for c in df.columns if c.lower() == "date")
            df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
            df.rename(columns={date_col: "date"}, inplace=True)
            df["date"] = df["date"].dt.strftime("%Y-%m-%d")

        # Replace NaN with None so JSON serialization works
        df = df.where(pd.notnull(df), None)

        return df, None
    except Exception as e:
        logger.exception("Error reading CSV")
        return None, str(e)


@app.route("/api/prices", methods=["GET"])
def api_prices():
    df, err = load_csv(FILES["prices"])
    if err: return jsonify({"error": err}), 404
    return jsonify(df.to_dict(orient="records"))

@app.route("/api/events", methods=["GET"])
def api_events():
    df, err = load_csv(FILES["events"])
    if err: return jsonify({"error": err}), 404
    return jsonify(df.to_dict(orient="records"))

@app.route("/api/single_cp", methods=["GET"])
def api_change_single():
    df, err = load_csv(FILES["single_cp"])
    if err: return jsonify({"error": err}), 404
    return jsonify(df.to_dict(orient="records"))

@app.route("/api/multi_cp", methods=["GET"])
def api_change_multi():
    df, err = load_csv(FILES["multi_cp"])
    if err: return jsonify({"error": err}), 404
    return jsonify(df.to_dict(orient="records"))

@app.route("/api/summary", methods=["GET"])
def api_summary():
    # Load all but return an aggregated JSON
    prices, e1 = load_csv(FILES["prices"])
    events, e2 = load_csv(FILES["events"])
    single_cp, e3 = load_csv(FILES["single_cp"])
    multi_cp, e4 = load_csv(FILES["multi_cp"])

    # For missing files, return empty lists and include errors
    response = {
        "prices": prices.to_dict(orient="records") if prices is not None else [],
        "events": events.to_dict(orient="records") if events is not None else [],
        "change_single": single_cp.to_dict(orient="records") if single_cp is not None else [],
        "change_multi": multi_cp.to_dict(orient="records") if multi_cp is not None else [],
        "errors": {"prices": e1, "events": e2, "single": e3, "multi": e4}
    }
    return jsonify(response)

# Serve frontend build for production (optional)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        index_path = os.path.join(app.static_folder, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(app.static_folder, "index.html")
        return "Frontend build not found", 404

if __name__ == "__main__":
    # for dev run single-threaded
    logger.info(f"Starting Flask app; data directory: {DATA_DIR}")
    app.run(host="0.0.0.0", port=5000, debug=True)
