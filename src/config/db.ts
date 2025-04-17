import { Sequelize } from 'sequelize';

// Configuration de la base de données PostgreSQL
const sequelize = new Sequelize('pokemon_tcg', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres', // Spécifie PostgreSQL comme dialecte
});

export default sequelize;