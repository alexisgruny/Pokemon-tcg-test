import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tgcptrade', 'postgres', 'Trimkiroo.0', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

export default sequelize;