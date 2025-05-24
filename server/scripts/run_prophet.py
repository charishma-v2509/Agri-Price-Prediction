
import pandas as pd
from prophet import Prophet
import sys
import json

# Load CSV
df = pd.read_csv("./data/synthetic_agriculture_market_data.csv", parse_dates=["Date"])

# Load user inputs
input_json = sys.argv[1]
inputs = json.loads(input_json)

state = inputs["state"]
market = inputs["market"]
commodity = inputs["commodity"]
unit = inputs.get("unit", "Quintal")
year = int(inputs["year"])
month = int(inputs["month"])
day = int(inputs["day"])

# Filter dataset
filtered_df = df[
    (df["State"] == state) &
    (df["Market"] == market) &
    (df["Commodity"] == commodity)
].copy()

# Prepare data for Prophet
filtered_df = filtered_df[["Date", "Modal Price"]].dropna()
filtered_df = filtered_df.rename(columns={"Date": "ds", "Modal Price": "y"})

# Train Prophet model
model = Prophet()
model.fit(filtered_df)

# Predict future
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)

conversion_factor = 1  # Default is quintal

if unit == "Kg":
    conversion_factor = 0.01  # 1 quintal = 100 kg
elif unit == "Gram":
    conversion_factor = 0.00001  

# Get prediction for specific date
target_date = pd.Timestamp(f"{year}-{month:02d}-{day:02d}")
row = forecast[forecast["ds"] == target_date]

if row.empty:
    print(json.dumps({"error": "Date not in forecast range"}))
else:
    price = round(row["yhat"].values[0], 2)
    converted_price = round(price * conversion_factor, 4)
    lower = round(row["yhat_lower"].values[0], 2)
    upper = round(row["yhat_upper"].values[0], 2)
    print(json.dumps({
        "date": target_date.strftime("%Y-%m-%d"),
        "predicted_price": converted_price,
        "unit":unit,
        "Min_Price": lower,
        "Max_Price": upper
    }))
