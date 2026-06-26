# Pokémon TCG API – Projet Personnel

Ce projet est une API Node.js développée avec TypeScript, connectée à une base de données postgreSQL, et intégrant des données externes depuis l’API publique Pokémon TCG.  
Elle permet de collecter, stocker et manipuler des cartes Pokémon dans une collection personnelle.

## 🚀 Fonctionnalités

- Connexion à l'API Pokémon TCG pour récupérer des cartes
- Enregistrement de cartes dans une base MongoDB
- Récupération de la collection personnelle
- Architecture MVC avec TypeScript
- Appels d'API sécurisés et asynchrones
- Middleware de base (logger, body parser, gestion des erreurs)

## 🧰 Stack technique

- Node.js
- Express.js
- TypeScript
- postgreSQL (Sequelize)
- Axios (pour les appels à l'API externe)

## 📦 Installation

```bash
git clone https://github.com/alexisgruny/Pokemon-tcg-test.git
cd Pokemon-tcg-test
npm install
npm run dev
