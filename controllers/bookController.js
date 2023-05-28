const Book = require("../models/Book");

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
        averageRating: bookData.ratings[0].grade,
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

// Mettre à jour un livre
exports.updateBook = (req, res, next) => {
    const bookId = req.params.id;
    // Logique pour mettre à jour le livre dans la base de données
    res.status(200).json({
        message: "Livre mis à jour avec succès !",
    });
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    const bookId = req.params.id;
    // Logique pour supprimer le livre de la base de données
    res.status(200).json({
        message: "Livre supprimé avec succès !",
    });
};
