let data; // Variable pour stocker les données du fichier CSV
let squareSize = 7; // Taille constante des carrés représentant les images
let canvaWidth = 1080 / 2;
let canvaHeight = 1080 / 2;

const maxImageWidth = 7656;
const maxImageHeight = 6000;

const minX = 0;
const maxX = 540;

let constantSize = false;
let showPics = false;

let gui;

let params = {
  saturation: 100,
  reload: function () {
    setup(false);
  },
  minimumPictureSize: 0,
  setConstantSize: function () {
    if (constantSize) constantSize = false;
    else constantSize = true;
    setup(false);
  },
  setShowPics: function () {
    if (showPics) showPics = false;
    else showPics = true;
    setup(false);
  },
  dataNb: 5000,
};

function preload() {
  // Charger les données du fichier CSV avant de démarrer le programme
  data = loadTable("../assets/data/data.csv", "csv", "header");
}

function setup(firstRun = true) {
  const canva = createCanvas(canvaWidth, canvaHeight); // Ajustez la taille du canevas selon vos besoins
  canva.parent("canva");
  colorMode(HSB, 360, 100, 100); // Mode de couleur HSB

  drawGraph();

  if (firstRun) setupGui();
}

function setupGui() {
  // Initialiser dat.GUI
  gui = new dat.GUI();
  gui.add(params, "saturation").min(0).max(100).step(5).name("Saturation");
  gui
    .add(params, "dataNb")
    .min(100)
    .max(data.getRowCount())
    .step(100)
    .name("Number of data");
  gui
    .add(params, "minimumPictureSize")
    .min(0)
    .max(5000000)
    .step(1000)
    .name("Minimum picture size");
  gui.add(params, "setConstantSize").name("Size of images/points");
  gui.add(params, "setShowPics").name("Show hue/pics");
  gui.add(params, "reload");
}

function drawGraph() {
  noStroke(); // Pas de contour pour les carrés

  // Trouver le centre de l'écran
  let centerX = width / 2;
  let centerY = height / 2;

  // Parcourir chaque ligne du CSV
  for (let i = 0; i < params.dataNb; i++) {
    let imageWidth = data.getNum(i, "width");
    let imageHeight = data.getNum(i, "height");

    if (imageWidth * imageHeight >= params.minimumPictureSize) {
      let file = data.getString(i, "file").slice(0, -4);
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

      if (showPics) {
        // Afficher image
        imageMode(CENTER);

        let img = loadImage(
          "../assets/data/imgs/" + file + "-10x10.jpg",
          (img) => image(img, mappedX, y)
        );
      } else {
        // Dessiner le carré représentant l'image
        rectMode(CENTER);
        fill(mappedHue, params.saturation, mappedLuminosity);

        if (constantSize) {
          ellipse(mappedX, y, squareSize, squareSize);
        } else {
          rect(mappedX, y, mappedImageWidth, mappedImageHeight);
        }
      }
    }
  }
}
