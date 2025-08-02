import os
import pandas as pd
import numpy as np

RAW_DATA_PATH = os.path.join('data', 'raw', 'BrentOilPrices.csv')
PROCESSED_DATA_PATH = os.path.join('data', 'processed', 'brent_oil_log_returns.csv')

def load_and_clean_data(file_path):
    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip().str.lower()
    df.rename(columns={'date': 'Date', 'price': 'Price'}, inplace=True)
    df['Date'] = pd.to_datetime(df['Date'], format='%d-%b-%y', errors='coerce')
    df.sort_values('Date', inplace=True)
    df.dropna(subset=['Date', 'Price'], inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df

def compute_log_returns(df):
    df['Log_Return'] = np.log(df['Price'] / df['Price'].shift(1))
    df.dropna(inplace=True)
    return df[['Date', 'Price', 'Log_Return']]

def save_processed_data(df, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[INFO] Processed data saved to: {output_path}")

def main():
    print("[INFO] Loading raw Brent oil data...")
    df_raw = load_and_clean_data(RAW_DATA_PATH)

    print("[INFO] Computing log returns...")
    df_processed = compute_log_returns(df_raw)

    print("[INFO] Saving processed data...")
    save_processed_data(df_processed, PROCESSED_DATA_PATH)

if __name__ == "__main__":
    main()
