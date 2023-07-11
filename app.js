var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var cron = require("node-cron");
var { spawn } = require("child_process");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//Cron-Job jeden Tag 00:00 Uhr
const fetchDataCronJob = cron.schedule("00 00 */1 * *", () => {
  // Pfade zu data-fetcher.js und app.js
  const dataFetcherScriptPath = path.join(
    __dirname,
    "controllers",
    "data-fetcher.js"
  );
  const appScriptPath = path.join(__dirname, "app.js");

  //Skript ausführen
  const dataFetcherProcess = spawn("node", [dataFetcherScriptPath]);

  //Ausgabe des Skripts
  dataFetcherProcess.stdout.on("data", (data) => {
    console.log(`data_fetcher.js: ${data}`);
  });

  dataFetcherProcess.stderr.on("data", (data) => {
    console.error(`data_fetcher.js (Fehler): ${data}`);
  });

  dataFetcherProcess.on("close", (code) => {
    if (code === 0) {
      console.log("data_fetcher.js erfolgreich abgeschlossen");
    } else {
      console.error(`data_fetcher.js mit Fehlercode beendet: ${code}`);
    }
  });
});

// Cron-Job start
fetchDataCronJob.start();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

module.exports = app;
