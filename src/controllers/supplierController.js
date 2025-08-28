import Joi from 'joi';
import { suppliers } from '../models/Supplier.js';
import { buildQueryOptions, applyQuery } from '../utils/paginate.js';
import { invalidatePattern } from '../middlewares/cache.js';

const schema = Joi.object({
  name: Joi.string().min(2).required(),
  contact: Joi.string().min(3).required(),
  location: Joi.string().min(2).required(),
});

export const listSuppliers = (req, res) => {
  const opts = buildQueryOptions(req.query);
  const { total, items } = applyQuery(suppliers, opts);
  res.json({ total, page: opts.page, limit: opts.limit, data: items });
};

export const createSupplier = (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const newItem = { id: `sup-${Date.now()}`, ...value, createdAt: Date.now() };
  suppliers.push(newItem);
  invalidatePattern('/api/v1/suppliers'); // invalidate cached list results
  res.status(201).json(newItem);
};

export const updateSupplier = (req, res) => {
  const { id } = req.params;
  const idx = suppliers.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Supplier not found' });

  const { error, value } = schema.validate(req.body, { presence: 'optional' });
  if (error) return res.status(400).json({ error: error.message });

  suppliers[idx] = { ...suppliers[idx], ...value };
  invalidatePattern('/api/v1/suppliers');
  res.json(suppliers[idx]);
};

export const deleteSupplier = (req, res) => {
  const { id } = req.params;
  const idx = suppliers.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Supplier not found' });

  const removed = suppliers.splice(idx, 1)[0];
  invalidatePattern('/api/v1/suppliers');
  res.json({ deleted: true, item: removed });
};