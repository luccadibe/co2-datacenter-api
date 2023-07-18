# API Documentation

The following sections describe the routes available in the CO2 Datacenter API.

## Route: /api/getDataByZone/:zone

**Description:**  
This route retrieves carbon intensity data for a specific zone.

**Method:**  
GET

**Parameters:**  
`zone` (required): The code representing the zone for which to retrieve the data.

**Response:**  
On success: Returns a JSON object containing an array of carbon intensity data for the specified zone.  
On error: Returns an error message.

**Example:**  
GET /api/getDataByZone/DE
**Response:**

```json
{
"history": [
{
"datetime": "2023-06-27T08:00:00.000Z",
"zone": "DE",
"carbonIntensity": 200
},
{
"datetime": "2023-06-27T07:00:00.000Z",
"zone": "DE",
"carbonIntensity": 190
},
...
]
}
```

## Route: /api/getBestZone/:timespan

**Description:**  
This route retrieves the zone with the best average carbon intensity within a specified timespan.

**Method:**  
GET

**Parameters:**
timespan (required): The timespan for calculating the average carbon intensity. Valid values are "day", "week", or "month".

**Response:**
On success: Returns a JSON object containing the zone with the best average carbon intensity.
On error: Returns an error message.

**Example:**
GET /api/getBestZone/week
**Response:**

```json
{
"zone": "DE",
"avgCarbonIntensity": 180
}
```

## How to run

First you need to setup a mysql 8 installation, in an accessible location to this server.

Then you need to create a .env file in the root of this directory with the following vars set:

```
DB_HOST="<domain db host>"
DB_USER="<user>"
DB_PASSWORD="<pw for user>"
DB_DATABASE="<database name>"
PORT="<port to bind the api to>"
```

Node >= 18 should suffice to run this application. Just run the following commands:

> npm install
> 
> npm start
