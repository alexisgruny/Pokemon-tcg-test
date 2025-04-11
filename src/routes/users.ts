import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('index'); // Rend la vue "index.ejs"
});

export default router;