const fs = require("fs");
const axios = require("axios");
const { promisify } = require("util");
const { query } = require("../db");

const zones = [
  "AT",
  "AU-NSW",
  "AU-QLD",
  "AU-SA",
  "AU-TAS",
  "AU-VIC",
  "AU-WA",
  "BE",
  "BG",
  "BR-CS",
  "BR-N",
  "BR-NE",
  "BR-S",
  "CA-ON",
  "CA-QC",
  "CH",
  "CL-SEN",
  "CR",
  "CZ",
  "DE",
  "DK-DK1",
  "DK-DK2",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HK",
  "ID",
  "IE",
  "IL",
  "IN-MH",
  "IN-UP",
  "IT-CNO",
  "IT-CSO",
  "IT-NO",
  "IT-SAR",
  "IT-SIC",
  "IT-SO",
  "JP-KN",
  "JP-TK",
  "KR",
  "LT",
  "LV",
  "NL",
  "NO-NO1",
  "NO-NO2",
  "NO-NO3",
  "NO-NO4",
  "NO-NO5",
  "NZ",
  "PA",
  "PE",
  "PL",
  "PT",
  "RO",
  "SE",
  "SG",
  "SI",
  "SK",
  "TR",
  "TW",
  "US-HI-OA",
  "US-CAL-BANC",
  "US-CAL-CISO",
  "US-CAL-IID",
  "US-CAL-LDWP",
  "US-CAL-TIDC",
  "US-CAR-CPLE",
  "US-CAR-CPLW",
  "US-CAR-DUK",
  "US-CAR-SC",
  "US-CAR-SCEG",
  "US-CAR-YAD",
  "US-CENT-SPA",
  "US-CENT-SWPP",
  "US-FLA-FMPP",
  "US-FLA-FPC",
  "US-FLA-FPL",
  "US-FLA-GVL",
  "US-FLA-JEA",
  "US-FLA-SEC",
  "US-FLA-TAL",
  "US-FLA-TEC",
  "US-MIDA-PJM",
  "US-MIDW-AECI",
  "US-MIDW-LGEE",
  "US-MIDW-MISO",
  "US-NE-ISNE",
  "US-NW-AVA",
  "US-NW-BPAT",
  "US-NW-CHPD",
  "US-NW-DOPD",
  "US-NW-GCPD",
  "US-NW-GRID",
  "US-NW-IPCO",
  "US-NW-NEVP",
  "US-NW-NWMT",
  "US-NW-PACE",
  "US-NW-PACW",
  "US-NW-PGE",
  "US-NW-PSCO",
  "US-NW-PSEI",
  "US-NW-SCL",
  "US-NW-TPWR",
  "US-NW-WACM",
  "US-NW-WAUW",
  "US-NY-NYIS",
  "US-SE-SOCO",
  "US-SW-AZPS",
  "US-SW-EPE",
  "US-SW-PNM",
  "US-SW-SRP",
  "US-SW-TEPC",
  "US-SW-WALC",
  "US-TEN-TVA",
  "US-TEX-ERCO",
  "UY",
  "ZA",
]; // alle verfügbaren zonen
const API_BASE_URL =
  "https://api-access.electricitymaps.com/2w97h07rvxvuaa1g/carbon-intensity/history";
const API_HEADERS = {
  "X-BLOBR-KEY": "WIezX8X7VhNtDKCcXdcMRmfP838cPYoP",
};

// Funktion zum Abrufen der Daten für eine bestimmte Zone
async function fetchDataForZone(zone) {
  try {
    const response = await axios.get(`${API_BASE_URL}?zone=${zone}`, {
      headers: API_HEADERS,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Fehler beim Abrufen der Daten für Zone ${zone}:`,
      error.message
    );
    return null;
  }
}

// Hauptfunktion zum Abrufen und Speichern der Daten für alle Zonen
async function fetchDataForAllZones() {
  for (const zone of zones) {
    const data = await fetchDataForZone(zone);
    if (data) {
      await insertData(data);
    }
    await delay(1000);
  }
}

// Hilfsfunktion zur Erzeugung einer Verzögerung
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function insertData(data) {
  const sql =
    "INSERT IGNORE INTO carbonIntensityData (datetime, zone, carbonIntensity) VALUES (?, ?, ?)";
  // Insert all 24 datapoints into the database
  try {
    for (const hist of data.history) {
      const datetime_correct = new Date(hist.datetime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const params = [datetime_correct, hist.zone, hist.carbonIntensity];
      await query(sql, params);
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
  console.log(`Inserted 24 entries for zone ${data.zone}`);
}

// Aufruf der Hauptfunktion
fetchDataForAllZones();
