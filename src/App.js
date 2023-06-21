import React, { useState, useEffect } from "react";
import { Bar, } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { format, parseISO } from "date-fns";

const App = () => {
  const [chartDatas, setChartData] = useState([]);
  const [formattedDate, setFormattedDate] = useState(
    "2023-06-20T14:52:48-01:00"
  );

  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    const parsedDate = parseISO(inputDate);
    const formattedDate = format(
      parsedDate,
      "yyyy-MM-dd'T'HH:mm:sss-xxx".slice(0, 21)
    );
    setFormattedDate(formattedDate);
  };

  const fetchPollutionData = async () => {
    try {
      const response = await axios.get(
        `https://api.openaq.org/v2/measurements?location_id=62543&parameter=temperature&parameter=um100&parameter=temperature&parameter=pm10&parameter=um010&parameter=pm1&parameter=pressure&parameter=um025&parameter=pm25&parameter=um005&parameter=um050&parameter=humidity&parameter=um003&date_from=2023-06-19T14:52:48-01:00&date_to=${formattedDate}&limit=30`
      );
      setChartData(response?.data?.results);
    } catch (error) {
      console.error("Error fetching pollution data:", error);
    }
  };

  useEffect(() => {
    fetchPollutionData();
  }, [formattedDate]);

  useEffect(() => {
    fetchPollutionData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const labels = chartDatas?.map((item) => item?.location) || [""];
  const values = chartDatas?.map((item) => item?.value) || [""];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Pollution Data",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container">
      <h2>Pollution Data Chart</h2>
      <div>
        <input
          type="date"
          onChange={handleDateChange}
          value={formattedDate.substring(0, 10)}
        />

        <select
          class="form-select form-select-lg mb-3"
          aria-label=".form-select-lg example"
        >
          <option value="">Open this select menu</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>
      {chartDatas.length ? (
        <div style={{ height: "90vh" }} className="container">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default App;
