import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUp,
  Calendar,
  Headphones,
  Percent,
  ShoppingCart,
  ShieldCheck,
  Star,
  Truck,
  User,
} from 'lucide-react';
import { getCatalogBooks } from '../lib/externalBooks';

const trustItems = [
  { icon: Truck, title: 'Return & Refund', sub: 'Money back guarantee' },
  { icon: ShieldCheck, title: 'Secure Payment', sub: '30% off by subscribing' },
  { icon: Headphones, title: 'Quality Support', sub: 'Always online 24/7' },
  { icon: Percent, title: 'Daily Offers', sub: '20% off by subscribing' },
];

const categoryBanners = [
  {
    title: 'Romantic Novels',
    desc: 'Heartfelt stories and timeless love — delivered to your door.',
    overlay: 'from-[#4a2c45]/85 via-[#4a2c45]/70 to-[#4a2c45]/50',
    image:
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Crime Fiction Books',
    desc: 'Twists, clues, and page-turners for late-night reads.',
    overlay: 'from-brand/90 via-brand/75 to-brand/55',
    image:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Romantic Novels',
    desc: 'Curated romance picks for your next weekend escape.',
    overlay: 'from-[#2c3a5a]/85 via-[#2c3a5a]/70 to-[#2c3a5a]/50',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=900&auto=format&fit=crop',
  },
];

const blogPosts = [
  {
    title: 'How to build a reading habit that lasts',
    date: 'Feb 10, 2024',
    author: 'Admin',
    tag: 'Activities',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Best mystery picks for rainy weekends',
    date: 'Feb 12, 2024',
    author: 'Admin',
    tag: 'Activities',
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Why local book delivery is booming',
    date: 'Feb 14, 2024',
    author: 'Admin',
    tag: 'Activities',
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Authors we love this season',
    date: 'Feb 18, 2024',
    author: 'Admin',
    tag: 'Activities',
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop',
  },
];

const featuredAuthors = [
  { id: 1, name: 'Olivia Wilson', image: '/girl 1.jpg', books: 12, rating: '4.8', reviews: '1.2k', genre: 'Romance' },
  { id: 2, name: 'Emma Watson', image: '/girl 2.jpg', books: 8, rating: '4.9', reviews: '856', genre: 'Mystery' },
  { id: 3, name: 'Sophia Martinez', image: '/girl 3.jpg', books: 15, rating: '4.7', reviews: '2.1k', genre: 'Sci-Fi' },
  { id: 4, name: 'Isabella Taylor', image: '/girl 4.jpg', books: 22, rating: '4.6', reviews: '3.4k', genre: 'Fantasy' },
  { id: 5, name: 'Mia Johnson', image: '/girl 5.jpg', books: 9, rating: '4.8', reviews: '940', genre: 'Biography' },
  { id: 6, name: 'Amelia Brown', image: '/girl 6.jpg', books: 14, rating: '4.5', reviews: '1.5k', genre: 'Thriller' },
  { id: 7, name: 'Harper Davis', image: '/girl 7.jpg', books: 7, rating: '4.9', reviews: '620', genre: 'Poetry' },
  { id: 8, name: 'Evelyn Miller', image: '/girl 8.jpg', books: 18, rating: '4.7', reviews: '2.8k', genre: 'Historical' },
  { id: 9, name: 'Abigail Garcia', image: '/girl 9.jpg', books: 11, rating: '4.6', reviews: '1.1k', genre: 'Self-Help' },
];

const ExploreMore = () => (
  <Link
    to="/browse"
    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/25 hover:bg-brand-deep transition-colors"
  >
    Explore More <ArrowRight className="w-4 h-4" />
  </Link>
);

const AuthorCard = ({ author }) => (
  <Link to="/browse" className="group block bg-brand-ink rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10">
    <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-sm">
      <img
        src={author.image}
        alt={author.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <span className="mb-2 inline-block rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand shadow-sm">
      {author.genre}
    </span>
    <h3 className="mb-1 text-[15px] font-semibold text-black group-hover:text-brand transition-colors">
      {author.name}
    </h3>
    <p className="mb-3 text-xs text-gray-500">{author.books} Published Books</p>
    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
      <Star className="h-3.5 w-3.5 fill-brand text-brand" />
      <span className="font-semibold text-black">{author.rating}</span>
      <span>({author.reviews})</span>
    </div>
  </Link>
);

const SoftBookCard = ({ book, badge, rating = '4.5', reviews = '25' }) => {
  const price = book.deliveryFee || 0;
  const oldPrice = price * 1.3;

  return (
    <Link to={`/books/${book._id}`} className="group block text-left">
      <div className="relative mb-4 aspect-square rounded-2xl bg-brand-ink p-5 flex items-center justify-center overflow-hidden">
        {badge && (
          <span
            className={`absolute top-3 left-3 z-10 rounded-md px-2.5 py-1 text-xs font-semibold text-white ${
              badge === 'Hot' ? 'bg-black' : 'bg-brand'
            }`}
          >
            {badge}
          </span>
        )}
        <img
          src={book.coverImage || '/default-book.png'}
          alt={book.title}
          className="max-h-full max-w-[70%] object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="text-xs text-gray-400 mb-1">{book.category || 'Design Low Book'}</p>
      <h3 className="font-semibold text-black text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-brand transition-colors">
        {book.title}
      </h3>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-bold text-black">${price.toFixed(2)}</span>
        <span className="text-sm text-brand line-through">${oldPrice.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-7 w-7 shrink-0 rounded-full bg-brand/20 overflow-hidden flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-brand" />
          </span>
          <span className="text-xs text-gray-500 truncate">{book.author || 'Author'}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 text-xs text-gray-500">
          <Star className="w-3.5 h-3.5 fill-brand text-brand" />
          <span>
            {rating} <span className="text-gray-400">({reviews})</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const { data: books, isLoading } = useQuery({
    queryKey: ['featuredBooks'],
    queryFn: async () => {
      const result = await getCatalogBooks({ search: 'fiction bestsellers', limit: 15 });
      return result.data;
    },
  });

  const authorBooks = books?.slice(0, 4) || [];
  const categoryBooks = books?.slice(0, 5) || [];

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="flex flex-col bg-white text-black font-sans relative">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-ink">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 50% at 15% 40%, rgba(255,123,107,0.12), transparent), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(255,255,255,0.8), transparent)',
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-20 md:pb-24 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="order-2 lg:order-1 max-w-xl">
            <p className="text-brand font-semibold text-sm md:text-base mb-4">
              50% Off On New Books
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.1] tracking-tight text-[#1a1f36] mb-5">
              Get Your New Book{' '}
              <span className="relative inline-block text-brand">
                The Best Price
                <svg
                  className="absolute left-0 -bottom-1 w-full h-3 text-brand"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 8C40 2 80 2 120 6C150 9 180 4 198 7"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Discover bestsellers and hidden gems from local librarians — delivered fast,
              priced fair, ready for your shelf.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/browse">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-7 py-3.5 text-sm font-semibold text-[#1a1f36] shadow-sm hover:border-brand/40 transition-colors"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/browse">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/30 hover:bg-brand-deep transition-colors"
                >
                  View All Books <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] aspect-square">
              <div className="absolute inset-[6%] rounded-full border-[10px] border-[#2a3148]/90 overflow-hidden bg-brand">
                <div
                  className="absolute inset-0 opacity-30 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-brand/55" />
              </div>
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop"
                alt="Happy reader with a new book"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[92%] w-auto max-w-none object-cover object-top drop-shadow-2xl"
              />
              <div className="absolute top-8 right-4 w-14 h-16 bg-white rounded shadow-lg rotate-12 opacity-90 hidden sm:block" />
              <div className="absolute top-16 right-16 w-12 h-14 bg-white rounded shadow-md -rotate-6 opacity-80 hidden sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="px-4 md:px-6 -mt-8 relative z-10">
        <div className="max-w-[1280px] mx-auto rounded-2xl bg-brand-ink px-5 py-6 md:px-10 md:py-7 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {trustItems.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-semibold text-[#1a1f36] text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover author books */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1a1f36]">
                Discover Your Favorite Authors
              </h2>
              <span className="mt-3 block h-2 w-2 rounded-full bg-brand" />
            </div>
            <ExploreMore />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
            {featuredAuthors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}

            <div className="col-span-2 md:col-span-3 lg:col-span-1 relative min-h-[220px] md:min-h-0 rounded-2xl overflow-hidden bg-brand flex flex-col items-center justify-center p-6 text-center group cursor-pointer shadow-md shadow-brand/20">
              <div
                className="absolute inset-0 opacity-25 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop')",
                }}
              />
              <div className="relative z-10 flex flex-col items-center mt-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5" />
                </span>
                <h3 className="font-display font-bold text-xl text-white mb-2">Become an Author</h3>
                <p className="text-sm text-white/90">Join our community and publish today.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top category books */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1a1f36]">
                Top Category Books
              </h2>
              <span className="mt-3 block h-2 w-2 rounded-full bg-brand" />
            </div>
            <ExploreMore />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-brand-ink animate-pulse" />
                ))
              : categoryBooks.map((book, idx) => (
                  <SoftBookCard
                    key={book._id}
                    book={book}
                    badge={idx === 0 ? 'Hot' : idx === 2 ? '-30%' : idx === 4 ? '-12%' : null}
                    rating={(3.4 + (idx % 4) * 0.2).toFixed(1)}
                  />
                ))}
          </div>
          <div className="flex justify-center mt-8">
            <span className="h-2 w-2 rounded-full bg-brand" />
          </div>
        </div>
      </section>

      {/* Category promo banners */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-3 gap-5">
          {categoryBanners.map((cat) => (
            <Link
              key={`${cat.title}-${cat.image}`}
              to="/browse"
              className="group relative min-h-[220px] rounded-2xl overflow-hidden p-6 flex flex-col justify-between"
            >
              <img
                src={cat.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.overlay}`} />
              <div className="relative flex items-start justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand">
                  25% Off
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                  <ShoppingCart className="w-4 h-4" />
                </span>
              </div>
              <div className="relative mt-10">
                <h3 className="font-display font-bold text-2xl text-white mb-2">{cat.title}</h3>
                <p className="text-sm text-white/85 leading-relaxed line-clamp-2">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest news */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-brand-ink relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c20-10 40 10 80 0' fill='none' stroke='%23ff7b6b' stroke-opacity='0.15' stroke-width='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1a1f36] mb-3">
              Our Latest News
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Fresh stories from the BiblioDrop community — reading tips, author spotlights,
              and delivery updates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    {post.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> By {post.author}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#1a1f36] text-[15px] leading-snug mb-4 line-clamp-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <Link
                    to="/browse"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand transition-colors"
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={scrollTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-deep transition-colors"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Home;
