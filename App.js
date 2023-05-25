const express = require("express");
const mongoose = require("mongoose");

const Book = require("./models/Book");
const User = require("./models/User");

// Créer une application Express
const app = express();

//Connexion à MongoDB
mongoose
    .connect(
        "mongodb+srv://eva02:GB7SJ10JDQfG2Sqg@cluster0.fnzvrq6.mongodb.net/test?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// Traitement des requêtes et réponses
// Rendre les données exploitables en JSON
app.use(express.json());

// Éviter les problèmes de CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// Routes

// Route pour créer un livre
app.post("/api/books", (req, res) => {
    // Logique pour créer un livre dans la base de données
    res.status(201).json({
        message: "Livre créé avec succès !",
    });
});

// Route pour obtenir la liste des livres
app.get("/api/books", (req, res) => {
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
});

// Route pour obtenir les détails d'un livre spécifique
app.get("/api/books/:id", (req, res) => {
    const bookId = req.params;
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
});

module.exports = app;
