# dashboard/backend/validate_data.py
import os, pandas as pd
from app import DATA_DIR, FILES, load_csv

def show_head(key):
    fname = FILES[key]
    df, err = load_csv(fname)
    print(f"\n--- {key} ({fname}) ---")
    if err:
        print("ERROR:", err)
        return
    print(df.head())
    print("Rows:", len(df))
    print("Columns:", df.columns.tolist())

if __name__ == "__main__":
    for k in FILES:
        show_head(k)
