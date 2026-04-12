import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectModule: pg,
        dialectOptions: isProduction ? { ssl: { require: true, rejectUnauthorized: false } } : {},
        pool: { max: 1, min: 0, idle: 0, acquire: 10000 },
        logging: false,
    })
    : new Sequelize(
        process.env.DB_NAME || 'pokemon_tcg',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres',
            port: parseInt(process.env.DB_PORT || '5432'),
            logging: false,
        }
    );

export default sequelize;