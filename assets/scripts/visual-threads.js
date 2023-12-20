let data; // Variable pour stocker les données du fichier CSV
let point = 10; //Point de rencontres (couleurs, la luminosité et la dimension)
let line; // Les fils représentant les images
let canvaWidth = 1080 / 2;
let canvaHeight = 1080 / 2;

function preload() {
  // Charger les données du fichier CSV avant de démarrer le programme
  data = loadTable("/assets/data/data.csv", "csv", "header");
}

function setup() {
  createCanvas(canvaWidth, canvaHeight); // Ajustez la taille du canevas selon vos besoins
  colorMode(HSB, 360, 100, 100); // Mode de couleur HSB

  // Trouver le premier point, concerne la teinte de l'image
  let tintX = 2;
  let tintY = 2;

  // Trouver le deuxième point, concerne la luminosité de l'image
  let lumX = width / 2;
  let lumY = height / 2;

  // Trouver le deuxième point, concerne la luminosité de l'image
  let weightX = width - 2;
  let weightY = height - 2;

  // Parcourir chaque ligne du CSV
  for (let i = 0; i < data.getRowCount(); i++) {
    let imageWidth = data.getNum(i, "width");
    let imageHeight = data.getNum(i, "height");
    let hue = data.getNum(i, "hue");
    let luminosity = data.getNum(i, "value");
    let mappedHue = map(hue, 0, 1, 0, 360);
    let mappedLuminosity = map(luminosity, 0, 1, 0, 100);

    // Dessiner une ligne représentant l'image
    // console.log(tintX, tintY);
    // fill(mappedHue, 100, mappedLuminosity);
  }
}

function draw() {
  background(255);
  stroke(0); // Couleur de la ligne (noir)
  strokeWeight(2); // Épaisseur de la ligne
  line(0, 0, 350, 100); // Dessine une ligne de (0, 0) à (350, 100)
}
