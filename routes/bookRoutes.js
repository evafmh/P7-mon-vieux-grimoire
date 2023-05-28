const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookController = require("../controllers/bookController");

// Créer un livre
router.post("/", auth, multer, bookController.createBook);

// Obtenir la liste des livres
router.get("/", bookController.getAllBooks);

// Obtenir les détails d'un livre spécifique
router.get("/:id", bookController.getBookById);

// Mettre à jour un livre
router.put("/:id", auth, bookController.updateBook);

// Supprimer un livre
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;
