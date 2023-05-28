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

// Stockage d'un fichier image
const upload = multer({ storage: storage }).single("image");

// Redimensionnement de l'image
const compressImage = (req, res, next) => {
    // Vérifie s'il y a bien un fichier
    if (!req.file) {
        return next();
    }

    //Récupère l'image
    const filePath = req.file.path;

    sharp(filePath)
        .resize({ width: 500 })
        .webp({ quality: 85 })
        .toBuffer()
        .then((data) => {
            sharp(data)
                .toFile(filePath)
                .then(() => {
                    next();
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch((err) => {
            next(err);
        });
};

// Téléchargement de l'image
const uploadImage = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                message:
                    "Une erreur est survenue lors du téléchargement du fichier.",
            });
        }
        next();
    });
};
module.exports = {
    uploadImage,
    compressImage,
};
