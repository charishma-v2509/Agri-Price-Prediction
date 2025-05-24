import sys
import json
import pandas as pd

data = json.load(sys.stdin)

df = pd.read_csv("./data/synthetic_agriculture_market_data.csv")

filtered = df[
    (df["Commodity"] == data["commodity"]) &
    (df["Market"] == data["market"]) &
    (df["State"] == data["state"])
]

if data["graph_type"] == "Month-wise":
    filtered["Date"] = pd.to_datetime(filtered["Date"])
    filtered["Month"] = filtered["Date"].dt.month
    trend = filtered.groupby("Month")["Modal Price"].mean().reset_index()
elif data["graph_type"] == "Year-wise":
    filtered["Date"] = pd.to_datetime(filtered["Date"])
    filtered["Year"] = filtered["Date"].dt.year
    trend = filtered.groupby("Year")["Modal Price"].mean().reset_index()
else:
    trend = filtered[["Date", "Modal Price"]]

trend.rename(columns={"Modal Price": "price"}, inplace=True)
print(trend.to_json(orient="records"))
