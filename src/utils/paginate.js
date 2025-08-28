export function buildQueryOptions(query) {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;

  // Basic search & filters
  const search = (query.search || '').toLowerCase();
  const type = query.type || ''; // e.g., 'feed' or 'fertilizer'
  const sort = query.sort || 'createdAt'; // e.g., '-quantity' or 'price'

  return { page, limit, skip, search, type, sort };
}

export function applyQuery(data, { search, type, sort, skip, limit }) {
  let result = data;

  // Filter by type
  if (type) {
    result = result.filter((i) => String(i.type).toLowerCase() === String(type).toLowerCase());
  }
  // Text search across a few fields
  if (search) {
    const term = search.toLowerCase();
    result = result.filter((i) =>
      String(i.title).toLowerCase().includes(term) ||
      String(i.description).toLowerCase().includes(term) ||
      String(i.location).toLowerCase().includes(term)
    );
  }
  // Sort (support '-' prefix for desc)
  if (sort) {
    const desc = sort.startsWith('-');
    const key = desc ? sort.slice(1) : sort;
    result = result.slice().sort((a, b) => {
      if (a[key] < b[key]) return desc ? 1 : -1;
      if (a[key] > b[key]) return desc ? -1 : 1;
      return 0;
    });
  }

  const total = result.length;
  const paged = result.slice(skip, skip + limit);
  return { total, items: paged };
}