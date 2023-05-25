const express = require("express");

// Créer une application Express
const app = express();

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
  const books = [
    {
      id: "1",
      title: "Le Grimoire Magique",
      author: "John Doe",
      imageUrl: "https://example.com/book1.jpg",
      year: 2020,
      genre: "Fantasy",
    },
    {
      id: "2",
      title: "Les Secrets de l'Alchimie",
      author: "Jane Smith",
      imageUrl: "https://example.com/book2.jpg",
      year: 2018,
      genre: "Mystère",
    },
  ];
  res.status(200).json(books);
});

// Route pour obtenir les détails d'un livre spécifique
app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  // Logique pour obtenir les détails du livre depuis la base de données
  const book = {
    id: bookId,
    title: "Le Grimoire Magique",
    author: "John Doe",
    imageUrl: "https://example.com/book1.jpg",
    year: 2020,
    genre: "Fantasy",
  };
  res.status(200).json(book);
});

// Route pour mettre à jour les informations d'un livre
app.put("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  // Logique pour mettre à jour les informations du livre dans la base de données
  res.status(200).json({
    message: "Livre mis à jour avec succès !",
  });
});

// Route pour supprimer un livre
app.delete("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  // Logique pour supprimer le livre de la base de données
  res.status(200).json({
    message: "Livre supprimé avec succès !",
  });
});

module.exports = app;
