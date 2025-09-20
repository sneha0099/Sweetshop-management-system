import { Router } from 'express';
import { addSweet } from '../controller/sweet.controller';
import { deleteSweet } from '../controller/sweet.controller';
import { getAllSweets } from '../controller/sweet.controller';
import { purchaseSweet } from '../controller/sweet.controller';
import { restockSweet } from '../controller/sweet.controller';
import { getAllCategories } from '../controller/sweet.controller';
import { updateSweet } from '../controller/sweet.controller';
import { requireRole } from '../middlewares/role.middleware';
import { requireAuth } from '../middlewares/auth.middleware';

const sweetRoutes = Router();

sweetRoutes.post('/', requireAuth, requireRole('admin'), addSweet);
sweetRoutes.patch('/:id', requireAuth, requireRole('admin'), updateSweet);
sweetRoutes.delete('/:id', requireAuth, requireRole('admin'), deleteSweet);
sweetRoutes.get('/', getAllSweets);
sweetRoutes.post('/:id/purchase', requireAuth, purchaseSweet);
sweetRoutes.patch('/:id/restock', requireAuth, requireRole('admin'), restockSweet);
sweetRoutes.get('/categories', getAllCategories);

export default sweetRoutes;
