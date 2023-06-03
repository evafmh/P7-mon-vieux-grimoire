const Book = require("../models/Book");
const fs = require("fs");

// Obtenir la liste des livres
exports.getAllBooks = (req, res, next) => {
    // Logique pour obtenir la liste des livres depuis la base de données
    Book.find()
        .then((books) => {
            if (books.length === 0) {
                return res.status(404).json({
                    message: "Aucun livre trouvé.",
                });
            }

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

//Vérifie le format des inputs du livre
const checkInputFormat = (title, author, genre, year) => {
    const errors = [];

    const titleRegex = /^[a-zA-Z0-9\sÀ-ÿ&;!?$£€.,':()]{3,50}$/; // Alphanumérique, espaces et caractères spéciaux
    const textOnlyRegex = /^[a-zA-Z\sÀ-ÿ]{3,50}$/; // Alphabet, espaces et accents
    const yearRegex = /^\d{4}$/; // Format YYYY

    if (title && !titleRegex.test(title)) {
        errors.push("Le format du titre est invalide.");
    }

    if (author && !textOnlyRegex.test(author)) {
        errors.push("Le format de l'auteur est invalide.");
    }

    if (year && !yearRegex.test(year)) {
        errors.push("L'année doit être au format YYYY.");
    }

    if (genre && !textOnlyRegex.test(genre)) {
        errors.push("Le format du genre est invalide.");
    }

    return errors;
};

// Créer un livre
exports.createBook = (req, res, next) => {
    try {
        const bookData = JSON.parse(req.body.book);

        delete bookData._id;
        delete bookData._userId;

        // Vérifie si le livre existe déjà en vérifiant le titre et l'auteur
        Book.findOne({ title: bookData.title, author: bookData.author })
            .then((existingBook) => {
                if (existingBook) {
                    throw new Error("Ce livre existe déjà.");
                }

                const { title, author, genre, year } = bookData;

                const errors = checkInputFormat(title, author, genre, year);

                if (errors.length > 0) {
                    return res.status(400).json({ error: errors.join(" ") });
                }

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
                        res.status(500).json({
                            error: error.message,
                        });
                    });
            })
            .catch((error) => {
                res.status(500).json({
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
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
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Vérifie si le livre a été trouvé
            if (!book) {
                res.status(404).json({
                    message: "Livre non trouvé.",
                });
            } else if (book.userId.toString() !== req.auth.userId) {
                // Vérifie que l'utilisateur est le créateur du livre
                res.status(403).json({
                    message: "Vous n'êtes pas autorisé à modifier ce livre.",
                });
            } else {
                // si un fichier a été chargé
                if (req.file) {
                    // Récupère le nom du fichier de l'ancienne image
                    const oldFilename = book.imageUrl.split("/images/")[1];
                    // Supprime l'ancienne image de manière synchrone
                    try {
                        fs.unlinkSync(`images/${oldFilename}`);
                    } catch (error) {
                        console.error(
                            "Erreur lors de la suppression de l'ancienne image",
                            error
                        );
                    }
                }

                // Vérifie le format des champs
                const { title, author, genre, year } = bookData;
                const errors = checkInputFormat(title, author, genre, year);

                if (errors.length > 0) {
                    return res.status(400).json({ error: errors.join(" ") });
                }

                // Mettre à jour les données du livre
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookData, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({
                            message: "Livre modifié avec succès !",
                        })
                    )
                    .catch((error) => {
                        res.status(400).json({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    // Recherche l'id du livre à supprimer dans la base de données
    const bookId = req.params.id;
    Book.findOne({ _id: bookId })
        .then((book) => {
            // Vérifie si le livre a été trouvé
            if (!book) {
                res.status(404).json({
                    message: "Livre non trouvé.",
                });
                // Vérifie que l'utilisateur est le créateur du livre
            } else if (book.userId.toString() !== req.auth.userId) {
                res.status(403).json({
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
                            res.status(200).json({
                                message: "Livre supprimé avec succès !",
                            })
                        )
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

//Notation des livres

//Noter un livre
exports.rateBook = (req, res, next) => {
    const bookId = req.params.id;
    const { userId, rating } = req.body;

    delete req.body._id;

    // Vérifie que la note est comprise entre 0 et 5
    const ratingFormat = /^[0-5]$/;
    if (!ratingFormat.test(rating)) {
        return res.status(400).json({
            message: "La note doit être un chiffre entre 0 et 5.",
        });
    }

    Book.findById(bookId)
        // Vérifie si le livre existe
        .then((book) => {
            if (!book) {
                throw new Error("Livre introuvable.");
            }

            return Book.findOne({ _id: bookId, "ratings.userId": userId }).then(
                (alreadyRated) => {
                    if (alreadyRated) {
                        throw new Error("Vous avez déjà noté ce livre.");
                    }

                    // Met à jour la moyenne des notations
                    const grades = book.ratings.map((rating) => rating.grade);
                    const sumRatings = grades.reduce(
                        (total, grade) => total + grade,
                        0
                    );

                    const newTotalRating = sumRatings + rating;
                    const newAverageRating = Number(
                        (newTotalRating / (book.ratings.length + 1)).toFixed(1)
                    );

                    // Mise à jour des données du livre dans la base de données
                    book.averageRating = newAverageRating;
                    book.totalRating += rating;
                    // Sauvegarde les modifications du livre dans la base de données
                    return (
                        Book.findByIdAndUpdate(
                            bookId,
                            {
                                $push: {
                                    ratings: { userId, grade: rating },
                                },
                                averageRating: newAverageRating,
                            },
                            { new: true }
                        )
                            // Le livre a été mis à jour avec la nouvelle note

                            .then((updatedBook) => {
                                res.status(201).json({
                                    message: "Livre noté avec succès.",
                                    book: {
                                        ...updatedBook,
                                        id: updatedBook._id,
                                    },
                                });
                            })
                    );
                }
            );
        })

        // Une erreur s'est produite lors de la notation du livre
        .catch((error) => {
            if (error.message === "Livre introuvable.") {
                return res.status(404).json({
                    message: "Livre introuvable.",
                });
            } else if (error.message === "Vous avez déjà noté ce livre.") {
                return res.status(403).json({
                    message: "Vous avez déjà noté ce livre.",
                });
            } else {
                return res.status(500).json({
                    message:
                        "Une erreur est survenue lors de la notation du livre.",
                });
            }
        });
};
