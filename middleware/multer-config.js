const multer = require("multer");
const sharp = require("sharp");

// Liste des types MIME des images acceptés
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    // Configuration du dossier de destination
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    //Configuration du nom du fichier
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + name + "." + extension);
    },
});

module.exports = multer({ storage }).single("image");
