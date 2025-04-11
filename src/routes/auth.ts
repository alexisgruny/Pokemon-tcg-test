import { Router } from 'express';

const router = Router();

// Afficher le formulaire d'inscription
router.get('/register', (req, res) => {
    res.render('register', { title: 'Inscription' });
});

// Gérer la soumission du formulaire
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Simuler une logique de traitement (par exemple, sauvegarder dans une base de données)
    console.log(`Nouvel utilisateur : ${username}, ${email}`);

    // Rediriger ou afficher un message de succès
    res.render('registerSuccess', { title: 'Inscription réussie', username });
});

export default router;