const express = require("express");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/bookRoutes");

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
app.use("/api/books", bookRoutes);

module.exports = app;
