let data; // Variable pour stocker les données du fichier CSV
let squareSize = 10; // Taille constante des carrés représentant les images
let canvaWidth = 1080 / 2;
let canvaHeight = 1080 / 2;

const maxImageWidth = 7656;
const maxImageHeight = 6000;

const minX = 0;
const maxX = 540;

function preload() {
  // Charger les données du fichier CSV avant de démarrer le programme
  data = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(canvaWidth, canvaHeight); // Ajustez la taille du canevas selon vos besoins
  colorMode(HSB, 360, 100, 100); // Mode de couleur HSB
  noStroke(); // Pas de contour pour les carrés

  // Trouver le centre de l'écran
  let centerX = width / 2;
  let centerY = height / 2;

  // Parcourir chaque ligne du CSV
  for (let i = 0; i < data.getRowCount(); i++) {
    let imageWidth = data.getNum(i, "width");
    let imageHeight = data.getNum(i, "height");

    let hue = data.getNum(i, "hue");
    let luminosity = data.getNum(i, "value");
    let mappedHue = hue * 360;
    let mappedLuminosity = luminosity * 100;

    let mappedImageWidth = map(imageWidth, 0, maxImageWidth, 1, 50);
    let mappedImageHeight = map(imageHeight, 0, maxImageHeight, 1, 50);

    // Convertir la position polaire en coordonnées cartésiennes
    let x = centerX + (width / 2) * cos(radians(mappedHue)) * luminosity;
    let y = centerY + (height / 2) * sin(radians(mappedHue)) * luminosity;

    let mappedX = map(x, 0, maxX, 0, canvaWidth - 25);

    // Dessiner le carré représentant l'image
    fill(mappedHue, 100, mappedLuminosity);
    rect(mappedX, y, mappedImageWidth, mappedImageHeight);
  }
}
