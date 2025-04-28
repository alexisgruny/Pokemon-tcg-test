import app from './app';
import sequelize from './config/db';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données PostgreSQL réussie.');

        await sequelize.sync({ force: false });
        console.log('Modèles synchronisés avec la base de données.');

        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erreur de connexion ou de synchronisation:', error);
        process.exit(1);
    }
}

startServer();