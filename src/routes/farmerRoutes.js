import { Router } from 'express';
import { cacheMiddleware } from '../middlewares/cache.js';
import { listFarmers, createFarmer, updateFarmer, deleteFarmer } from '../controllers/farmerController.js';

const router = Router();

router.get('/', cacheMiddleware, listFarmers);
router.post('/', createFarmer);
router.patch('/:id', updateFarmer);
router.delete('/:id', deleteFarmer);

export default router;