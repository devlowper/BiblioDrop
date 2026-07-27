import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import { getBookByExternalId, getCatalogBooks } from '../lib/externalBooks';
import Button from '../components/ui/Button';
import SoftBookCard from '../components/ui/SoftBookCard';
import toast from 'react-hot-toast';
import { Loader2, Heart, Maximize2, Check, Star } from 'lucide-react';

const fieldClass = 'w-full p-3 bg-brand-ink border border-brand/20 text-black placeholder:text-gray-500 rounded-sm focus:ring-1 focus:ring-brand focus:border-brand focus:outline-none text-sm';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      if (id?.startsWith('ol-') || id?.startsWith('gb-')) {
        return getBookByExternalId(id);
      }
      try {
        const res = await api.get(`/books/${id}`);
        return res.data.data;
      } catch {
        return getBookByExternalId(id);
      }
    }
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/reviews/book/${id}`);
        return res.data.data;
      } catch {
        return [];
      }
    },
    enabled: !!id && !id?.startsWith('ol-') && !id?.startsWith('gb-'),
  });

  const { data: relatedBooks } = useQuery({
    queryKey: ['relatedBooks', book?.category],
    queryFn: async () => {
      const search = book?.category || 'fiction bestsellers';
      const result = await getCatalogBooks({ search, limit: 5 });
      return result.data;
    },
    enabled: !!book,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review.");
    try {
      await api.post('/reviews', {
        bookId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userName: user.name
      });
      toast.success('Review added');
      setReviewForm({ rating: 5, comment: '' });
      refetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#ff7b6b]" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-black mb-4">Book not found</h2>
          <Button variant="outline" onClick={() => navigate('/browse')}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const isOwner = !!user && (user.email === book.librarianEmail || user.role === 'admin');
  const isAvailable = book.availability === 'available';
  const price = book.deliveryFee || 16.00; 
  const mainImg = book.coverImage || '/default-book.png';
  const gallery = [mainImg, mainImg, mainImg, mainImg, mainImg]; 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Images */}
        <div className="w-full lg:w-[45%] shrink-0">
          <div className="bg-[#f8f8f8] rounded-[2rem] p-8 md:p-12 flex items-center justify-center mb-6 h-[400px] md:h-[550px] border border-gray-100 shadow-inner">
            <img src={mainImg} alt={book.title} className="max-h-full max-w-[80%] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="grid grid-cols-5 gap-3">
            {gallery.map((img, i) => (
              <div key={i} className={`aspect-[3/4] rounded-lg border-2 overflow-hidden p-1.5 cursor-pointer bg-[#f8f8f8] ${i === 0 ? 'border-[#ff7b6b]' : 'border-gray-200 hover:border-[#ff7b6b]/50'}`}>
                <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded shadow-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="w-full lg:w-[55%] flex flex-col pt-2">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="font-display text-4xl md:text-[42px] font-bold text-[#1a1f36] leading-tight mb-2">
                {book.title}
              </h1>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex text-[#ffb703]">
                  {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <Star className="w-4 h-4 fill-current opacity-30" />
                </div>
                <span className="text-gray-500 text-sm font-medium">({reviews?.length || 1} Customer Reviews)</span>
              </div>
            </div>
            <div className="mt-2 md:mt-3 md:text-right">
              <span className="text-[#32CD32] font-bold tracking-wide text-[13px] whitespace-nowrap">
                {isAvailable ? 'Stock Availability.' : 'Out of Stock.'}
              </span>
            </div>
          </div>

          <p className="text-gray-500 leading-[1.8] mb-8 text-[14px]">
            {book.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar, tortor quis varius pretium est felis scelerisque nulla, vitae placerat justo nunc a massa. Aenean nec montes vestibulum urna vel imperdiet ipsum. Orci varius natoque penatibus et magnis dis ridiculus parturient montes.'}
          </p>

          <div className="text-[#ff7b6b] font-display font-bold text-[32px] mb-8">
            ${price.toFixed(2)}
          </div>

          {!isOwner && isAvailable && (
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden h-[52px] w-[110px] shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors text-lg"
                >-</button>
                <input 
                  type="text" 
                  value={quantity}
                  readOnly
                  className="flex-1 w-full text-center font-bold text-[#1a1f36] border-x border-gray-100 py-2 focus:outline-none bg-transparent"
                />
                <button 
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors text-lg"
                >+</button>
              </div>

              <button className="h-[52px] px-8 rounded-full border-2 border-[#ff7b6b] text-[#ff7b6b] font-bold text-[15px] hover:bg-[#ff7b6b]/5 transition-colors tracking-wide">
                Read A Little
              </button>

              <button 
                onClick={() => {
                  addToCart(book, quantity);
                  toast.success('Added to cart!');
                }}
                className="h-[52px] px-10 rounded-full bg-[#ff7b6b] text-white font-bold text-[15px] hover:bg-[#e85a4a] shadow-lg shadow-brand/20 transition-all tracking-wide"
              >
                Add To Cart
              </button>

              <button className="h-[52px] w-[52px] rounded-full border-2 border-gray-100 flex items-center justify-center text-[#ff7b6b] hover:bg-[#ff7b6b] hover:text-white hover:border-[#ff7b6b] transition-all bg-white shadow-sm">
                <Heart className="w-[18px] h-[18px] fill-current opacity-90" />
              </button>
              
              <button className="h-[52px] w-[52px] rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1a1f36] transition-colors bg-white shadow-sm">
                <Maximize2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          )}

          {isOwner && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-10">
              <p className="text-sm font-medium text-black">You are the owner of this book.</p>
              <Link to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/librarian'}>
                <Button variant="outline" className="mt-4 text-sm">Go to Dashboard</Button>
              </Link>
            </div>
          )}

          {/* Meta Data Box */}
          <div className="bg-white border border-gray-200 rounded-[14px] p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-[13px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">SKU:</span>
                <span className="text-gray-500">FTC1020B65D</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">Tags:</span>
                <span className="text-gray-500">Design Low Book</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">Total page:</span>
                <span className="text-gray-500">330</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">Publish Years:</span>
                <span className="text-gray-500">2021</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">Category:</span>
                <span className="text-gray-500">{book.category || 'Kids Toys'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">Format:</span>
                <span className="text-gray-500">Hardcover</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">Language:</span>
                <span className="text-gray-500">English</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1f36] min-w-[75px]">Century:</span>
                <span className="text-gray-500">United States</span>
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="bg-white border border-gray-200 rounded-[14px] p-6 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 text-[13px] text-gray-500 font-medium">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff7b6b]" strokeWidth={3} />
                <span>Free shipping orders from $150</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff7b6b]" strokeWidth={3} />
                <span>Mamaya Flash Discount: Starting at 30% Off</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff7b6b]" strokeWidth={3} />
                <span>30 days exchange & return</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff7b6b]" strokeWidth={3} />
                <span>Safe & Secure online shopping</span>
              </div>
            </div>
          </div>

          {/* Also Available On */}
          <div className="flex items-center gap-6 text-[13px]">
            <span className="font-bold text-[#1a1f36]">Also Available On:</span>
            <div className="flex items-center gap-6 grayscale opacity-80">
              <div className="flex items-center gap-1.5 font-bold text-[#1a1f36] text-[15px]">
                 <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF5C77] to-[#FF8C36]"></div>
                 customer.io
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#1a1f36] text-[15px]">
                 amazon
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#1a1f36] text-[15px]">
                 <div className="w-4 h-4 bg-[#0061FF] rotate-45 transform skew-x-12"></div>
                 Dropbox
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20 border-t border-gray-200 pt-10 mb-20">
        <div className="flex justify-center gap-8 md:gap-12 mb-10 border-b border-gray-200 px-4">
          {['Description', 'Additional Information', `Reviews (${reviews?.length || 0})`].map((tab, idx) => {
            const key = ['description', 'additional', 'reviews'][idx];
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 text-[15px] font-bold transition-colors relative ${
                  activeTab === key ? 'text-[#ff7b6b]' : 'text-[#1a1f36] hover:text-[#ff7b6b]'
                }`}
              >
                {tab}
                {activeTab === key && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#ff7b6b]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="max-w-[1280px] mx-auto px-4">
          {activeTab === 'description' && (
            <div className="text-gray-500 text-[14px] leading-relaxed">
              {book.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis erat interdum, tempor turpis in, sodales ex. In hac habitasse platea dictumst. Etiam accumsan scelerisque urna, a lobortis velit vehicula ut. Maecenas porttitor dolor a velit aliquet, et euismod nibh vulputate. Duis nunc velit, lacinia vel risus in, finibus sodales augue. Aliquam lacinia imperdiet dictum. Etiam tempus finibus tortor, quis placerat arcu tristique in. Sed vitae dui a diam luctus maximus. Quisque nec felis dapibus, dapibus enim vitae, vestibulum libero. Aliquam erat volutpat. Phasellus luctus rhoncus justo. Duis a nulla sit amet justo aliquam ullamcorper. Phasellus nulla lorem, pretium et libero in, porta auctor dui. In a ornare purus, et efficitur elit. Etiam consectetur sit amet quam ut tincidunt. Donec gravida ultricies tellus ac pharetra. Praesent a pulvinar purus. Proin sollicitudin leo eget mi sagittis aliquam. Donec sollicitudin ex ac lobortis mollis. Sed eget libero nec mi'}
            </div>
          )}
          {activeTab === 'additional' && (
            <div className="text-gray-500 text-[14px] leading-relaxed">
              Additional information about format, publisher, and dimensions would go here.
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {user && !isOwner && (
                <form onSubmit={handleReviewSubmit} className="mb-10 bg-[#f8f8f8] p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-[#1a1f36] mb-4">Leave a Review</h4>
                  <div className="flex gap-4 mb-4">
                    <select 
                      className={fieldClass}
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                    >
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <textarea 
                    required
                    rows="4"
                    className={`${fieldClass} mb-4 bg-white`}
                    placeholder="Share your thoughts about this book..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  />
                  <button type="submit" className="px-8 py-3 bg-[#1a1f36] text-white font-bold rounded-full hover:bg-black transition-colors text-sm">Submit Review</button>
                </form>
              )}

              {(reviews?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic text-sm text-center py-10">No reviews yet. Be the first to review!</p>
              ) : (
                reviews?.map(review => (
                  <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-[#1a1f36]">{review.userName}</span>
                      <div className="flex text-[#ffb703]">
                        {Array.from({length: 5}).map((_, i) => (
                           <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'fill-transparent stroke-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{review.comment}</p>
                    <p className="text-[12px] text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-32 text-center pb-10">
        <h2 className="font-display font-bold text-3xl md:text-[36px] text-[#1a1f36] mb-4">
          Related Products
        </h2>
        <p className="text-gray-400 text-[14px] mb-12 max-w-xl mx-auto leading-relaxed">
          Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec at nulla nulla. Duis posuere ex lacus
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 text-left">
          {relatedBooks?.map((book, idx) => (
            <SoftBookCard
              key={book._id}
              book={book}
              badge={idx === 0 ? 'Hot' : idx === 1 ? '-30%' : idx === 4 ? 'Hot' : null}
              rating={(3.4 + (idx % 4) * 0.2).toFixed(1)}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default BookDetails;
