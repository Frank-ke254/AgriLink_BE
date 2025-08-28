import Joi from 'joi';
import { farmers } from '../models/Farmer.js';
import { buildQueryOptions, applyQuery } from '../utils/paginate.js';
import { invalidatePattern } from '../middlewares/cache.js';

const schema = Joi.object({
  name: Joi.string().min(2).required(),
  contact: Joi.string().min(3).required(),
  location: Joi.string().min(2).required(),
});

export const listFarmers = (req, res) => {
  const opts = buildQueryOptions(req.query);
  const { total, items } = applyQuery(farmers, opts);
  res.json({ total, page: opts.page, limit: opts.limit, data: items });
};

export const createFarmer = (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const newItem = { id: `far-${Date.now()}`, ...value, createdAt: Date.now() };
  farmers.push(newItem);
  invalidatePattern('/api/v1/farmers');
  res.status(201).json(newItem);
};

export const updateFarmer = (req, res) => {
  const { id } = req.params;
  const idx = farmers.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Farmer not found' });

  const { error, value } = schema.validate(req.body, { presence: 'optional' });
  if (error) return res.status(400).json({ error: error.message });

  farmers[idx] = { ...farmers[idx], ...value };
  invalidatePattern('/api/v1/farmers');
  res.json(farmers[idx]);
};

export const deleteFarmer = (req, res) => {
  const { id } = req.params;
  const idx = farmers.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Farmer not found' });

  const removed = farmers.splice(idx, 1)[0];
  invalidatePattern('/api/v1/farmers');
  res.json({ deleted: true, item: removed });
};