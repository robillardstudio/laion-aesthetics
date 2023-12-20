let data; // variable pour stocker les données du fichier CSV
const canvaWidth = 1920 / 1.2;
const canvaHeight = 1080 / 1.2;

const xHue = 50;
const xValue = 500;
const xRes = 1000;

const margin = 100;

function preload() {
  // Charger le fichier CSV
  data = loadTable("/assets/data/data.csv", "csv", "header");
}

function setup() {
  createCanvas(canvaWidth, canvaHeight);
  background(255);
  drawAxes();
  drawPoints();
}

function drawAxes() {
  // Dessiner les axes
  stroke(0);
  line(xHue, 50, xHue, height - 50); // Axe de la teinte (hue)
  line(xValue, 50, xValue, height - 50); // Axe de la luminosité (value)
  line(xRes, 50, xRes, height - 50); // Axe de la résolution (width * height)

  textAlign(CENTER, CENTER);
  textSize(14);

  // Étiquettes des axes
  text("Teinte", xHue, margin / 4);
  text("Luminosité", xValue, margin / 4);
  text("Résolution", xRes, margin / 4);
}

function drawPoints() {
  const maxRow = data.getRowCount();
  colorMode(HSB, 360, 100, 100); // Mode de couleur HSB

  // Parcourir toutes les lignes du fichier CSV
  for (let i = 0; i < 1000; i++) {
    // Extraire les valeurs nécessaires
    const hue = data.getNum(i, "hue");
    const value = data.getNum(i, "value");
    const resolution = data.getNum(i, "width") * data.getNum(i, "height");

    // Normaliser les valeurs pour les ajuster à l'échelle du canva
    const yHue = map(hue, 0, 1, height - margin, 0 + margin);
    const yValue = map(value, 0, 1, height - margin, 0 + margin);
    const yRes = map(
      resolution,
      0,
      maxResolution(),
      height - margin,
      0 + margin
    );

    // Get color
    const luminosity = data.getNum(i, "value");
    const mappedHue = hue * 360;
    const mappedLuminosity = luminosity * 100;

    // Dessiner un point sur le canva
    fill(mappedHue, 100, mappedLuminosity);
    ellipse(xHue, yHue, 5, 5);
    ellipse(xValue, yValue, 5, 5);
    ellipse(xRes, yRes, 5, 5);

    stroke(mappedHue, 100, mappedLuminosity);
    line(xHue, yHue, xValue, yValue);
    line(xValue, yValue, xRes, yRes);
  }
}

function maxResolution() {
  // Fonction pour trouver la résolution maximale dans les données
  let maxRes = 0;
  for (let i = 0; i < data.getRowCount(); i++) {
    let widthVal = float(data.getString(i, "width"));
    let heightVal = float(data.getString(i, "height"));
    let resolution = widthVal * heightVal;
    if (resolution > maxRes) {
      maxRes = resolution;
    }
  }
  return maxRes;
}
