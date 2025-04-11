import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Accueil', message: 'Bienvenue sur le site Pokémon TCG !' });
});;

export default router;