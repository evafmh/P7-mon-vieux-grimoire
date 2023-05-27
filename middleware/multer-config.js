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

// Fonction de validation de fichier avec des promesses
const fileFilter = (req, file) => {
    return new Promise((resolve, reject) => {
        // Vérification de la taille maximale
        const maxFileSize = 1024 * 1024 * 5;
        if (file.size > maxFileSize) {
            reject(
                new Error(
                    `L'image dépasse la taille maximale autorisée (${(
                        maxFileSize /
                        (1024 * 1024)
                    ).toFixed(2)} Mo). Veuillez choisir une image plus petite.`
                )
            );
        }

        // Vérification des dimensions minimales
        const minWidth = 300;
        const minHeight = 300;
        sharp(file.buffer)
            .metadata()
            .then((metadata) => {
                if (metadata.width < minWidth || metadata.height < minHeight) {
                    reject(
                        new Error(
                            `L'image est trop petite. Veuillez choisir une image de taille ${minWidth}x${minHeight} pixels au minimum.`
                        )
                    );
                }

                // Le fichier est valide
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Configuration du middleware Multer pour télécharger les images
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Limite la taille des fichiers à 5 Mo
    },
    fileFilter: fileFilter, // Utilisation de la fonction de validation de fichier
}).single("image");

// Middleware pour redimensionner l'image avant l'upload
const resizeImage = (req, res, next) => {
    //Vérification si une image a été téléchargée
    if (!req.file) {
        return next();
    }

    const image = sharp(req.file.buffer);
    image.metadata().then((metadata) => {
        const maxWidth = 500;
        const originalWidth = metadata.width;
        if (originalWidth > maxWidth) {
            image.resize({ width: maxWidth });
        }
        next();
    });
};

// Middleware pour gérer les fichiers image téléchargés
const imageUploader = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message:
                    "Une erreur est survenue lors du téléchargement de l'image. Veuillez réessayer ultérieurement.",
            });
        }
        next();
    });
};

module.exports = imageUploader;
