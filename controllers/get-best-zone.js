const { query } = require("../db");

const getBestZone = async (req, res) => {
  const { timespan } = req.params;

  // Determine the number of entries based on the timespan
  let numEntries;
  if (timespan === "day") {
    numEntries = 24;
  } else if (timespan === "week") {
    numEntries = 168;
  } else if (timespan === "month") {
    numEntries = 720;
  } else {
    return res.status(400).json({ error: "Invalid timespan" });
  }

  try {
    // Retrieve the best zone based on the average carbon intensity
    const sql =
      "SELECT zone, AVG(carbonIntensity) AS avgCarbonIntensity " +
      "FROM carbonIntensityData " +
      "WHERE datetime >= (SELECT MAX(datetime) FROM carbonIntensityData) - INTERVAL ? HOUR " +
      "GROUP BY zone " +
      "ORDER BY avgCarbonIntensity ASC " +
      "LIMIT 1";
    const params = [numEntries];

    const results = await query(sql, params);

    if (results.length === 0) {
      return res.status(404).json({ error: "No data available" });
    }

    const bestZone = results[0];

    // Return the response with the best zone and average carbon intensity
    res.json({
      zone: bestZone.zone,
      avgCarbonIntensity: bestZone.avgCarbonIntensity,
    });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = { getBestZone };
