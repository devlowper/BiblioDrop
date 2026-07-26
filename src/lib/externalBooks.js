/**
 * Open Library + Google Books catalog (no local backend required).
 */

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '';

const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Biography',
  'Children',
  'Mystery',
  'Romance',
];

const feeFromKey = (key = '') => {
  let n = 0;
  for (let i = 0; i < key.length; i++) n += key.charCodeAt(i);
  return Number((4.99 + (n % 20) + (n % 7) * 0.5).toFixed(2));
};

const mapOpenLibraryDoc = (doc) => {
  const id = doc.key?.replace('/works/', '') || doc.cover_edition_key || String(doc.cover_i);
  const cover = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    : '/default-book.png';

  return {
    _id: `ol-${id}`,
    title: doc.title || 'Untitled',
    author: doc.author_name?.[0] || 'Unknown Author',
    description: doc.first_sentence?.[0] || doc.subtitle || 'A great read from the Open Library catalog.',
    category: doc.subject?.[0]?.split(' ')[0] || CATEGORIES[Math.abs(feeFromKey(id)) % CATEGORIES.length],
    coverImage: cover,
    deliveryFee: feeFromKey(id),
    availability: 'available',
    status: 'published',
    source: 'openlibrary',
    olKey: doc.key,
  };
};

const mapGoogleVolume = (item) => {
  const info = item.volumeInfo || {};
  const image =
    info.imageLinks?.large ||
    info.imageLinks?.thumbnail ||
    info.imageLinks?.smallThumbnail ||
    '/default-book.png';

  return {
    _id: `gb-${item.id}`,
    title: info.title || 'Untitled',
    author: info.authors?.[0] || 'Unknown Author',
    description: info.description || 'A curated title from Google Books.',
    category: info.categories?.[0] || CATEGORIES[item.id.charCodeAt(0) % CATEGORIES.length],
    coverImage: String(image).replace('http:', 'https:'),
    deliveryFee: feeFromKey(item.id),
    availability: 'available',
    status: 'published',
    source: 'google',
    googleId: item.id,
  };
};

async function fetchOpenLibrary({ search = '', category = '', page = 1, limit = 12 } = {}) {
  const q = search || (category ? `subject:${category}` : 'bestseller fiction');
  const offset = (Math.max(1, page) - 1) * limit;
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&fields=key,title,author_name,cover_i,subject,first_sentence,subtitle,cover_edition_key`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Open Library request failed');
  const data = await res.json();
  const docs = (data.docs || []).filter((d) => d.cover_i);
  const books = docs.map(mapOpenLibraryDoc);

  return {
    data: books,
    pagination: {
      total: data.numFound || books.length,
      page: Number(page),
      pages: Math.max(1, Math.ceil((data.numFound || books.length) / limit)),
    },
  };
}

async function fetchGoogleBooks({ search = '', category = '', page = 1, limit = 12 } = {}) {
  const q = search || (category ? `subject:${category}` : 'fiction bestsellers');
  const startIndex = (Math.max(1, page) - 1) * limit;
  const keyParam = GOOGLE_KEY ? `&key=${GOOGLE_KEY}` : '';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${Math.min(limit, 40)}${keyParam}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Google Books request failed');
  const data = await res.json();
  const books = (data.items || []).map(mapGoogleVolume);

  return {
    data: books,
    pagination: {
      total: data.totalItems || books.length,
      page: Number(page),
      pages: Math.max(1, Math.ceil((data.totalItems || books.length) / limit)),
    },
  };
}

/** Public catalog list — Open Library first, Google Books fallback */
export async function getCatalogBooks(params = {}) {
  try {
    const result = await fetchOpenLibrary(params);
    if (result.data.length) return result;
  } catch {
    /* fall through */
  }
  return fetchGoogleBooks(params);
}

export async function getBookByExternalId(id) {
  if (id?.startsWith('gb-')) {
    const googleId = id.slice(3);
    const keyParam = GOOGLE_KEY ? `?key=${GOOGLE_KEY}` : '';
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${googleId}${keyParam}`);
    if (!res.ok) throw new Error('Book not found');
    const item = await res.json();
    return mapGoogleVolume(item);
  }

  // Open Library work
  const workId = id?.startsWith('ol-') ? id.slice(3) : id;
  const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
  if (!res.ok) throw new Error('Book not found');
  const work = await res.json();

  let coverImage = '/default-book.png';
  if (work.covers?.[0]) {
    coverImage = `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`;
  }

  let author = 'Unknown Author';
  try {
    const authorKey = work.authors?.[0]?.author?.key;
    if (authorKey) {
      const aRes = await fetch(`https://openlibrary.org${authorKey}.json`);
      if (aRes.ok) {
        const a = await aRes.json();
        author = a.name || author;
      }
    }
  } catch {
    /* ignore */
  }

  const description =
    typeof work.description === 'string'
      ? work.description
      : work.description?.value || 'A great read from the Open Library catalog.';

  return {
    _id: `ol-${workId}`,
    title: work.title || 'Untitled',
    author,
    description,
    category: work.subjects?.[0] || 'Fiction',
    coverImage,
    deliveryFee: feeFromKey(workId),
    availability: 'available',
    status: 'published',
    source: 'openlibrary',
  };
}

export { CATEGORIES };
