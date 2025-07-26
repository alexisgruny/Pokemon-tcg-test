import app from './app';
import sequelize from './config/db';
import { syncCardsFromApi, syncSetsFromApi} from './services/tcgdexService';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Connexion à la base de données
        await sequelize.authenticate(); 
        await sequelize.sync({ force: false }); 
        console.log('Connexion à la base de données réussie.');

        // Démarre le serveur
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        }); 
    } catch (error) {
        console.error('Erreur de connexion ou de synchronisation:', error);
        process.exit(1);
    }
} 

startServer();