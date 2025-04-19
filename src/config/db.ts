import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tgcptrade', 'postgres', 'Trimkiroo.0', {
    host: 'localhost', // Adresse du serveur PostgreSQL
    dialect: 'postgres', // Spécifie PostgreSQL comme dialecte
    port: 5432, // Port par défaut de PostgreSQL
});

export default sequelize;