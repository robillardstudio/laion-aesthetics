let data; // variable pour stocker les données du fichier CSV
const canvaWidth = 1080;
const canvaHeight = 1080 / 1.2;

const margin = 100;
let gui;

let maxRes;

const xValue = 50;
const xHue = 500;
const xRes = 1000;

let params = {
  reload: function () {
    setup(false);
    drawAxes();
  },
  dataNb: 1000,
};

function preload() {
  // Charger le fichier CSV
  data = loadTable("../assets/data/data.csv", "csv", "header");
}

function setup(firstRun = true) {
  const canva = createCanvas(canvaWidth, canvaHeight);
  canva.parent("canva");

  maxRes = maxResolution();

  drawAxes();
  drawPoints();

  if (firstRun) {
    setupGui();
  }
}

function setupGui() {
  // Initialiser dat.GUI
  gui = new dat.GUI();
  gui
    .add(params, "dataNb")
    .min(100)
    .max(data.getRowCount())
    .step(100)
    .name("Number of data");

  gui.add(params, "reload");
}

function drawAxes() {
  // Dessiner les axes
  stroke(0);
  line(xHue, 50, xHue, height - 50); // Axe de la teinte (hue)
  line(xValue, 50, xValue, height - 50); // Axe de la luminosité (value)
  line(xRes, 50, xRes, height - 50); // Axe de la résolution (width * height)

  // Étiquettes des axes
  textAlign(CENTER, CENTER);
  textSize(14);
  noStroke();
  fill("black");
  text("Teinte", xHue, margin / 4);
  text("Luminosité", xValue, margin / 4);
  text("Résolution", xRes, margin / 4);

  const maxResLabel = floor(exp(sqrt(maxRes)) / 1000);

  text(maxResLabel + "k", xRes + margin / 2, margin);

  text(100, xValue - margin / 4, margin);
  text(0, xValue - margin / 4, height - margin);
}

function calcRes(x) {
  return log(x) ** 2;
}

function drawPoints() {
  colorMode(HSB, 360, 100, 100); // Mode de couleur HSB

  // Parcourir toutes les lignes du fichier CSV
  for (let i = 0; i < params.dataNb; i++) {
    // Extraire les valeurs nécessaires
    const hue = data.getNum(i, "hue");
    const value = data.getNum(i, "value");
    const res = data.getNum(i, "width") * data.getNum(i, "height");
    const resolution = calcRes(res);

    // Normaliser les valeurs pour les ajuster à l'échelle du canva
    const yHue = map(hue, 0, 1, height - margin, 0 + margin);
    const yValue = map(value, 0, 1, height - margin, 0 + margin);
    const yRes = map(resolution, 0, maxRes, height - margin, 0 + margin);

    // Get color
    const luminosity = data.getNum(i, "value");
    const mappedHue = hue * 360;
    const mappedLuminosity = luminosity * 100;

    // Dessiner un point sur le canva
    noStroke();
    fill(mappedHue, 100, mappedLuminosity);
    ellipse(xHue, yHue, 5, 5);
    ellipse(xValue, yValue, 5, 5);
    ellipse(xRes, yRes, 5, 5);

    fill("black");

    let rate = 0.003;
    let floorNb = 10000;

    if (params.dataNb > 4000) {
      rate = 0.0008;
      floorNb = 5000;
    }

    if (res < floorNb || random() < rate) text(floor(res), xRes + 50, yRes);

    stroke(mappedHue, 100, mappedLuminosity);

    line(xValue, yValue, xHue, yHue);
    line(xHue, yHue, xRes, yRes);
  }
}

function maxResolution() {
  // Fonction pour trouver la résolution maximale dans les données
  let maxRes = 0;
  for (let i = 0; i < data.getRowCount(); i++) {
    let widthVal = float(data.getString(i, "width"));
    let heightVal = float(data.getString(i, "height"));
    let resolution = calcRes(widthVal * heightVal);
    if (resolution > maxRes) {
      maxRes = resolution;
    }
  }
  return maxRes;
}
