import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import "../index.css";

const Prediction = () => {
  const [formData, setFormData] = useState({
    state: "",
    market: "",
    commodity: "",
    unit: "",
    year: "",
    month: "",
    day: "",
    graph: "",
  });

  const [options, setOptions] = useState({
    states: [],
    markets: [],
    commodities: [],
  });

  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [showGraphSection, setShowGraphSection] = useState(false);
  const [selectedGraphType, setSelectedGraphType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/options")
      .then((res) => setOptions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/predict",
        formData
      );
      setLoading(false);
      setResult(res.data);
      setShowGraphSection(true);
    } catch (err) {
      console.error(err);
      setResult({ error: "Prediction failed. Enter the correct data" });
      setShowGraphSection(false);
    }
  };

  const handleShowGraph = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/trends", {
        ...formData,
        graph_type: selectedGraphType,
      });
      setLoading(false);
      setGraphData(res.data);
    } catch (err) {
      console.error("Error fetching graph data", err);
    }
  };

  return (
    <div className="container">
      <h2>Commodity Price Prediction</h2>
      <form onSubmit={handleSubmit}>
        {[
          {
            name: "state",
            label: "State",
            type: "select",
            options: options.states,
          },
          {
            name: "market",
            label: "Market",
            type: "select",
            options: options.markets,
          },
          {
            name: "commodity",
            label: "Commodity",
            type: "select",
            options: options.commodities,
          },
          {
            name: "unit",
            label: "Unit",
            type: "select",
            options: ["Quintal", "Kg", "Gram"],
          },
          { name: "year", label: "Year", type: "number" },
          { name: "month", label: "Month", type: "number" },
          { name: "day", label: "Day", type: "number" },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              >
                <option value="">-- Select --</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>

      {result && (
        <div className="result">
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p>
                <strong>Date:</strong> {result.date}
              </p>
              <p>
                <strong>Predicted Price:</strong> ₹{result.predicted_price} /{" "}
                {result.unit}
              </p>
            </>
          )}
        </div>
      )}
      {loading && <p>Loading...</p>}

      {showGraphSection && result && !result.error && (
        <div className="graph-section">
          <p>Do you want to see price trends?</p>
          <select
            value={selectedGraphType}
            onChange={(e) => setSelectedGraphType(e.target.value)}
          >
            <option value="">-- Select Graph Type --</option>
            <option value="Month-wise">Month-wise</option>
            <option value="Year-wise">Year-wise</option>
          </select>
          <button onClick={handleShowGraph} disabled={!selectedGraphType}>
            Show Trends
          </button>
        </div>
      )}

      {graphData && (
        <div className="chart">
          <h3>Price Trends</h3>
          <LineChart width={600} height={300} data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={selectedGraphType === "Year-wise" ? "Year" : "Month"}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default Prediction;
