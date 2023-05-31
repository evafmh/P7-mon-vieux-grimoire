// Fonction de validation des champs du livre
const validateBookFields = (req, res, next) => {
    // Vérifier les champs du livre dans req.body
    const { title, author, genre, year } = req.body;

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

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(" ") });
    }

    next();
};

module.exports = { validateBookFields };
