const Book = require("../models/Book");
const fs = require("fs");

// Obtenir la liste des livres
exports.getAllBooks = (req, res, next) => {
    // Logique pour obtenir la liste des livres depuis la base de données
    Book.find()
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des livres.",
            });
        });
};

// Obtenir les détails d'un livre spécifique
exports.getBookById = (req, res, next) => {
    const bookId = req.params.id;
    // Logique pour obtenir les détails du livre depuis la base de données
    Book.findById(bookId)
        .then((book) => {
            if (!book) {
                return res.status(404).json({
                    error: "Livre non trouvé.",
                });
            }

            res.status(200).json(book);
        })
        .catch((error) => {
            res.status(500).json({
                error: "Une erreur est survenue lors de la récupération du livre.",
            });
        });
};

// Obtenir les livres ayant la meilleure note
exports.getBooksByBestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des livres avec la meilleure note.",
            });
        });
};

// Créer un livre
exports.createBook = (req, res, next) => {
    const bookData = JSON.parse(req.body.book);

    delete bookData._id;
    delete bookData._userId;

    const book = new Book({
        ...bookData,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
        averageRating: 0, // Initialise la note moyenne à 0
        ratings: [], // Initialise le tableau d'évaluations à vide
    });

    book.save()
        .then(() => {
            res.status(201).json({
                message: "Livre créé avec succès !",
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// Modifier un livre
exports.updateBook = (req, res, next) => {
    // Vérifie si une image a été téléchargée, si oui on traite l'image sinon on traite l'objet
    const bookData = req.file
        ? {
              ...JSON.parse(req.body.book),
              // Mise à jour de l'imageUrl du livre avec la nouvelle image
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    delete bookData._userId;
    // Recherche le livre en fonction de l'id
    Book.findOne({ _id: req.params.id }).then((book) => {
        // Vérifie que l'utilisateur est le créateur du livre
        if (book.userId.toString() !== req.auth.userId) {
            res.status(401).json({
                message: "Vous n'êtes pas autorisé à modifier le livre.",
            });
        } else {
            // Mettre à jour les données du livre
            Book.updateOne(
                { _id: req.params.id },
                { ...bookData, _id: req.params.id }
            )
                .then(() =>
                    res.status(201).json({
                        message: "Livre modifié avec succès !",
                    })
                )
                .catch((error) => {
                    res.status(400).json({ error });
                });
        }
    });
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    // Recherche l'id du livre à supprimer dans la base de données
    const bookId = req.params.id;
    Book.findOne({ _id: bookId })
        .then((book) => {
            // Vérifie que l'utilisateur est le créateur du livre
            if (book.userId.toString() !== req.auth.userId) {
                res.status(401).json({
                    message: "Vous n'êtes pas autorisé à supprimer ce livre.",
                });
            } else {
                // Récupère le nom du fichier
                const filename = book.imageUrl.split("/images/")[1];
                // Supprime le fichier
                fs.unlink(`images/${filename}`, () => {
                    // Supprime le livre de la base de données
                    Book.deleteOne({ _id: bookId })
                        .then(() =>
                            res.status(201).json({
                                message: "Livre supprimé avec succès !",
                            })
                        )
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
