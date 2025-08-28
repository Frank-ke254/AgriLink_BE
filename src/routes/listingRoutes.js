import { Router } from 'express';
import { cacheMiddleware } from '../middlewares/cache.js';
import { listListings, createListing, updateListing, deleteListing } from '../controllers/listingController.js';

const router = Router();

router.get('/', cacheMiddleware, listListings);
router.post('/', createListing);
router.patch('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;