import React from 'react';
import { Link } from 'react-router-dom';
import { User, Star } from 'lucide-react';

const SoftBookCard = ({ book, badge, rating = '4.5', reviews = '25' }) => {
  const price = book.deliveryFee || 0;
  const oldPrice = price * 1.3;

  return (
    <Link to={`/books/${book._id}`} className="group block text-left">
      <div className="relative mb-4 aspect-square rounded-2xl bg-brand-ink p-5 flex items-center justify-center overflow-hidden">
        {badge && (
          <span
            className={`absolute top-3 left-3 z-10 rounded-md px-2.5 py-1 text-xs font-semibold text-white ${badge === 'Hot' ? 'bg-black' : 'bg-brand'
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

export default SoftBookCard;
