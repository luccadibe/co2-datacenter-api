const { query } = require("../db");

//get data by zone
async function getDataByZone(req, res) {
  const { zone } = req.params;

  try {
    const sql = `
      SELECT datetime, zone, carbonIntensity
      FROM carbonIntensityData
      WHERE zone = ?
      ORDER BY datetime DESC
      LIMIT 24
    `;
    const params = [zone];
    const results = await query(sql, params);

    const data = results.map((row) => ({
      datetime: row.datetime,
      zone: row.zone,
      carbonIntensity: row.carbonIntensity,
    }));

    res.json({ history: data });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
}

module.exports = { getDataByZone };
