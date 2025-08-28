import Joi from 'joi';
import { listings } from '../models/Listing.js';
import { buildQueryOptions, applyQuery } from '../utils/paginate.js';
import { invalidatePattern } from '../middlewares/cache.js';

const schema = Joi.object({
  supplierId: Joi.string().required(),
  title: Joi.string().min(2).required(),
  description: Joi.string().allow(''),
  type: Joi.string().valid('feed', 'fertilizer').required(),
  quantity: Joi.number().min(0).required(),
  location: Joi.string().min(2).required(),
});

export const listListings = (req, res) => {
  const opts = buildQueryOptions(req.query);
  const { total, items } = applyQuery(listings, opts);
  res.json({ total, page: opts.page, limit: opts.limit, data: items });
};

export const createListing = (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const newItem = { id: `lst-${Date.now()}`, ...value, createdAt: Date.now() };
  listings.push(newItem);
  invalidatePattern('/api/v1/listings');
  res.status(201).json(newItem);
};

export const updateListing = (req, res) => {
  const { id } = req.params;
  const idx = listings.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Listing not found' });

  const { error, value } = schema.validate(req.body, { presence: 'optional' });
  if (error) return res.status(400).json({ error: error.message });

  listings[idx] = { ...listings[idx], ...value };
  invalidatePattern('/api/v1/listings');
  res.json(listings[idx]);
};

export const deleteListing = (req, res) => {
  const { id } = req.params;
  const idx = listings.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Listing not found' });

  const removed = listings.splice(idx, 1)[0];
  invalidatePattern('/api/v1/listings');
  res.json({ deleted: true, item: removed });
};