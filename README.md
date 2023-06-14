# Mon Vieux Grimoire - Backend

Ce dépôt contient le backend de l'application Mon Vieux Grimoire : un site web de référencement et de notation de livres.

## Prérequis

Avant d'installer et d'exécuter ce projet, assurez-vous d'avoir installé :

-   Node.js (version v20.2.0)
-   npm (version 9.6.6)

## Installation

Suivez les étapes ci-dessous pour installer et configurer le projet localement :

1. Clonez ce dépôt sur votre machine :\
   `git clone https://github.com/evafmh/P7-mon-vieux-grimoire-backend.git`

2. Accédez au répertoire du projet :\
   `cd P7-mon-vieux-grimoire-backend`

3. Installez les dépendances nécessaires avec la commande suivante :\
   `npm install`

## Configuration de la Base de Données

Avant de lancer le projet, assurez-vous d'avoir configuré votre base de données MongoDB. Vous pouvez suivre les étapes suivantes :

1. Accédez au site web de MongoDB https://www.mongodb.com/cloud/atlas/register et inscrivez-vous pour obtenir un compte.

2. Une fois que vous avez accès à votre tableau de bord, créez un cluster et configurez-le selon vos besoins.

3. Récupérez votre code URI sur MongoDB et ajoutez-le dans un fichier .env.local que vous créez à la racine du projet. Configurez les variables d'environnement suivantes (variables listées dans le fichier .env):

```
PORT=PORT_BackEnd
DB*URI=URL_de_connexion_à_MongoDB
TOKEN_SECRET=Votre_clé_secrète_pour_les_tokens_JWT
```

-   Remplacez `PORT_BackEnd` par le port local sur lequel votre backend sera connecté (par défaut : 4000).
-   Remplacez `URL_de_connexion_à_MongoDB` par l'URL de connexion à votre base de données MongoDB, sous le format `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority.`
-   Remplacez `Votre_clé_secrète_pour_les_tokens_JWT` par une clé secrète de votre choix pour les tokens JWT.

## Lancement du backend :

Lancez l'application avec la commande suivante :\
`npm start`

L'application sera accessible à l'adresse http://localhost:4000. Si le serveur fonctionne sur un port différent pour une raison quelconque, le numéro de port correspondant s'affichera dans la console.

## Fonctionnalités :

Gestion des livres : ajout, mise à jour et suppression de livres.\
Notation des livres : possibilité de noter les livres sur une échelle de 0 à 5.\
Authentification : inscription et connexion des utilisateurs.

## Front-End

Le frontend de l'application est accessible dans le référentiel suivant :\
https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres

Pour l'utiliser, procédez comme suit :

1. Clonez le dépôt.
2. Exécutez `npm install` pour installer les dépendances du projet.\
3. Exécutez `npm start` pour démarrer le projet.\

L'application sera accessible à l'adresse http://localhost:3000. Si le serveur fonctionne sur un port différent pour une raison quelconque, le numéro de port correspondant s'affichera dans la console.
