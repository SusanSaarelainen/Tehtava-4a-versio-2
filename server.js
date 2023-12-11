const express = require("express");
const fs = require("fs");

const app = express();

const port = 3000;

let sanakirja = [];

const data = fs.readFileSync("./sanakirja.txt", {
  encoding: "utf8",
  flag: "r",
});

const splitLines = data.split(/\r?\n/); //jaetaan merkkijono rivin vaihtojen perusteella

splitLines.forEach((line) => {
  const sanat = line.split(" "); //jaetaan yhden rivin merkkijono kahteen osaan

  const sana = {
    fin: sanat[0],
    eng: sanat[1],
  };

  sanakirja.push(sana);
});

console.log(sanakirja);

app.use(express.json()); //käytetään json -muotoista dataa

app.use(express.urlencoded({ extended: true })); //käytetään tiedonsiirrossa laajennettua muotoa

//CORS -määrittely
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-type", "application/json");

  next();
});

app.get("/sanakirja", (req, res) => {
  res.json(sanakirja);
});

app.get("/:suomSana", (req, res) => {
  const fsana = req.params.suomSana; // otetaan esim. "talo" ylös
  let sana = sanakirja.find((element) => {
    return element.fin == fsana;
  });
  if (sana == undefined) res.status(200).send("sanaa ei löytynyt");
  else res.status(200).send(sana.eng);
});

app.post("/", (req, res, next) => {
  const suomeksi = req.body.fin;
  const englanniksi = req.body.eng;

  const tall_rivi = "\n" + suomeksi + " " + englanniksi; //tallennettava rivi

  const uusisana = {
    fin: suomeksi,
    eng: englanniksi,
  };

  sanakirja.push(uusisana);

  try {
    fs.appendFileSync("./sanakirja.txt", tall_rivi); //liittää tiedostoon yhen rivin
  } catch (err) {
    console.error(err);
  }
  res.status(201).send(req.body.fin + " " + req.body.eng + " lisätty.");
});

app.listen(port, () => {
  console.log(`Kuunnellaan portissa ${port}`);
});
