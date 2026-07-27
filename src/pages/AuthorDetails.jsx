import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, User, BookOpen, ArrowLeft, PenTool, Award, Heart } from 'lucide-react';
import { getCatalogBooks } from '../lib/externalBooks';

const AuthorBookCard = ({ book }) => {
  const price = book.deliveryFee || 0;
  const oldPrice = price * 1.3;

  return (
    <Link to={`/books/${book._id}`} className="group block text-left bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="relative mb-4 aspect-[3/4] rounded-xl bg-brand-ink p-4 flex items-center justify-center overflow-hidden">
        <img
          src={book.coverImage || '/default-book.png'}
          alt={book.title}
          className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="text-xs text-gray-400 mb-1 truncate">{book.category || 'Fiction'}</p>
      <h3 className="font-semibold text-black text-[14px] leading-snug line-clamp-2 mb-2 group-hover:text-brand transition-colors">
        {book.title}
      </h3>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-bold text-black">${price.toFixed(2)}</span>
        <span className="text-xs text-brand line-through">${oldPrice.toFixed(2)}</span>
      </div>
    </Link>
  );
};

const AuthorDetails = () => {
  const { authorName } = useParams();
  const decodedName = decodeURIComponent(authorName || '');

  const { data: books, isLoading } = useQuery({
    queryKey: ['authorBooks', decodedName],
    queryFn: async () => {
      // Fetch books specifically for this author
      const result = await getCatalogBooks({ search: decodedName, limit: 12 });
      return result.data;
    },
    enabled: !!decodedName,
  });
  
  // Deterministically pick an image based on author name length/characters so it stays consistent
  const imgIndex = (decodedName.length % 9) + 1;
  const authorImage = `/girl ${imgIndex}.jpg`;

  const rating = (4.0 + (decodedName.length % 10) * 0.1).toFixed(1);
  const reviews = decodedName.length * 123 + 45;

  return (
    <div className="bg-[#fcfaf9] min-h-screen pb-20">
      {/* Author Header */}
      <div className="bg-white px-4 md:px-6 pt-8 pb-10 rounded-b-[3rem] shadow-sm relative z-10 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand transition-colors mb-6 bg-brand-ink px-4 py-2 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8 max-w-[1000px] mx-auto">
            <div className="shrink-0 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-[4px] border-brand/10 shadow-md bg-brand-ink">
                <img src={authorImage} alt={decodedName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 whitespace-nowrap">
                <Star className="w-3 h-3 fill-white text-white" />
                {rating}
              </div>
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#1a1f36] mb-3 tracking-tight">
                {decodedName}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-5 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="font-semibold text-black text-sm">{books?.length || 0}</span> Books
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <User className="w-4 h-4" />
                  </span>
                  <span className="font-semibold text-black text-sm">{reviews.toLocaleString()}</span> Followers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm grid md:grid-cols-2 gap-10 md:gap-16 items-center border border-gray-100">
          <div className="order-2 md:order-1">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-[#1a1f36] mb-4">
              About {decodedName}
            </h2>
            <span className="block h-1 w-12 rounded-full bg-brand mb-6" />
            <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-5">
              {decodedName} is an internationally acclaimed author whose works have captivated readers across the globe. With a unique storytelling style that blends emotional depth with thrilling narratives, their books have consistently topped bestseller lists.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-8">
              When not writing, {decodedName} enjoys exploring local bookstores, participating in community reading programs, and drawing inspiration from the everyday lives of ordinary people. Their journey into the world of literature began at a young age, and they have since dedicated their life to the art of words.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 bg-brand-ink/50 p-3 rounded-xl border border-brand/5">
                 <PenTool className="w-5 h-5 text-brand" />
                 <span className="text-sm font-semibold text-[#1a1f36]">Creative Writer</span>
               </div>
               <div className="flex items-center gap-3 bg-brand-ink/50 p-3 rounded-xl border border-brand/5">
                 <Award className="w-5 h-5 text-brand" />
                 <span className="text-sm font-semibold text-[#1a1f36]">Award Winner</span>
               </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg relative z-10 border-[6px] border-brand-ink/60">
              <img src={authorImage} alt={decodedName} className="w-full h-full object-cover" />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 hidden lg:flex border border-gray-50">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-brand fill-brand/20" />
              </div>
              <div>
                <p className="font-bold text-[#1a1f36]">Passionate</p>
                <p className="text-xs text-gray-500">Storyteller</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-[#1a1f36]">
              Books by {decodedName}
            </h2>
            <span className="mt-3 block h-1.5 w-12 rounded-full bg-brand" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white animate-pulse shadow-sm" />
            ))
          ) : books && books.length > 0 ? (
            books.map((book) => (
              <AuthorBookCard key={book._id} book={book} />
            ))
          ) : (
            <div className="col-span-full py-16 bg-white rounded-2xl text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No books found for this author right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;
