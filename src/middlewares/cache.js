import NodeCache from 'node-cache';
const ttl = parseInt(process.env.CACHE_TTL_SECONDS || '120', 10);

export const cache = new NodeCache({ stdTTL: ttl, checkperiod: ttl * 0.2 });

// Key generator: build a stable key from path + sorted query params
export const keyFromReq = (req) => {
  const params = new URLSearchParams(req.query);
  // sort keys for stability
  const sorted = new URLSearchParams();
  [...params.keys()].sort().forEach(k => sorted.set(k, params.get(k)));
  return `${req.originalUrl.split('?')[0]}?${sorted.toString()}`;
};

export const cacheMiddleware = (req, res, next) => {
  const key = keyFromReq(req);
  const hit = cache.get(key);
  if (hit) {
    return res.json({ cached: true, ...hit });
  }
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body);
    return originalJson(body);
  };
  next();
};

export const invalidatePattern = (pattern) => {
  const keys = cache.keys();
  keys.forEach(k => {
    if (k.startsWith(pattern)) cache.del(k);
  });
};