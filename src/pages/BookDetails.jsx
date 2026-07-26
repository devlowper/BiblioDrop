import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { getBookByExternalId } from '../lib/externalBooks';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const fieldClass =
  'w-full p-3 bg-brand-ink border border-brand/20 text-black placeholder:text-gray-500 rounded-sm focus:ring-1 focus:ring-brand focus:border-brand focus:outline-none text-sm';

const CheckoutForm = ({ book, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-payment-intent', { bookId: book._id });
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          await api.post('/deliveries', {
            bookId: book._id,
            transactionId: result.paymentIntent.id
          });
          toast.success('Payment successful! Delivery requested.');
          onSuccess();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border border-brand/15 p-6 bg-brand-panel signal-border">
      <h3 className="font-bold text-black mb-4">Complete Payment</h3>
      <div className="p-3 border border-brand/20 bg-brand-ink">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#1f1416',
              '::placeholder': { color: '#b88a85' },
              iconColor: '#FF7B6B',
            },
            invalid: { color: '#e85a4a' },
          },
        }}/>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary" className="flex-1" disabled={!stripe || loading}>
          {loading ? 'Processing...' : `Pay $${(book.deliveryFee || 0).toFixed(2)}`}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const { data: book, isLoading, refetch } = useQuery({
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
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
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

  const isOwner = user?.email === book.librarianEmail || user?.role === 'admin';
  const isAvailable = book.availability === 'available';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/browse" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Browse
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 shrink-0">
          <div className="aspect-[3/4] bg-brand-ink overflow-hidden border border-brand/15">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <img src="/default-book.png" alt={book.title} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-brand/10 border border-brand/30 text-xs font-mono font-bold uppercase tracking-wider text-brand mb-4">
              {book.category}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-black mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 font-medium">by {book.author}</p>
          </div>

          <div className="py-6 border-t border-b border-brand/15 my-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-1 font-mono">Delivery Fee</p>
                <p className="text-3xl font-bold text-black">${(book.deliveryFee || 0).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-1 font-mono">Status</p>
                <div className="flex items-center gap-2 justify-end">
                  <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-brand' : 'bg-gray-500'}`}></div>
                  <span className="font-bold uppercase text-sm text-black">
                    {isAvailable ? 'Available Now' : 'Checked Out'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-none text-gray-600 mb-8 leading-relaxed">
            <p>{book.description || 'No description provided.'}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {!isOwner && (
              <>
                {!showCheckout ? (
                  <Button 
                    variant="primary" 
                    className="flex-1 py-3 text-lg"
                    disabled={!isAvailable}
                    onClick={() => {
                      if (book.source === 'openlibrary' || book.source === 'google' || id?.startsWith('ol-') || id?.startsWith('gb-')) {
                        toast.success('Book saved to wishlist — delivery checkout needs the backend server.');
                        return;
                      }
                      if (!user) {
                        toast('Please login to request delivery', { icon: 'ℹ️' });
                        navigate('/login');
                      } else {
                        setShowCheckout(true);
                      }
                    }}
                  >
                    {isAvailable ? 'Request Delivery' : 'Currently Unavailable'}
                  </Button>
                ) : (
                  <div className="w-full">
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        book={book} 
                        onSuccess={() => {
                          setShowCheckout(false);
                          refetch();
                        }} 
                        onCancel={() => setShowCheckout(false)} 
                      />
                    </Elements>
                  </div>
                )}
              </>
            )}
            {isOwner && (
              <div className="p-4 bg-brand-panel border border-brand/15 w-full signal-border">
                <p className="text-sm font-medium text-black">You are the owner of this book.</p>
                <p className="text-xs text-gray-400 mt-1">Manage this listing from your dashboard.</p>
                <Link to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/librarian'}>
                  <Button variant="outline" className="mt-4 w-full text-sm">Go to Dashboard</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-16">
            <h3 className="font-display text-2xl font-bold tracking-tight text-black mb-8">Reader Reviews</h3>
            
            {user && !isOwner && (
              <form onSubmit={handleReviewSubmit} className="mb-10 bg-brand-panel p-6 border border-brand/15 signal-border">
                <h4 className="font-mono font-bold mb-4 text-sm uppercase tracking-wider text-brand">Leave a Review</h4>
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
                  rows="3"
                  className={`${fieldClass} mb-4`}
                  placeholder="Share your thoughts about this book..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                />
                <Button variant="primary" type="submit">Submit Review</Button>
              </form>
            )}

            <div className="space-y-6">
              {(reviews?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic text-sm">No reviews yet.</p>
              ) : (
                reviews?.map(review => (
                  <div key={review._id} className="border-b border-brand/15 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-black">{review.userName}</span>
                      <span className="text-xs text-brand bg-brand/10 border border-brand/20 px-2 py-1 font-mono">{review.rating} / 5 Stars</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
