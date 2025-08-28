import { Router } from 'express';
import { cacheMiddleware } from '../middlewares/cache.js';
import { listSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController.js';

const router = Router();

router.get('/', cacheMiddleware, listSuppliers);
router.post('/', createSupplier);
router.patch('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;