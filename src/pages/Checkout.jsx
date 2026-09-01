import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { getBookByExternalId } from '../lib/externalBooks';
import { useCart } from '../context/CartContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ book, clientSecret, isCartCheckout, cartItems, totalAmount, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    const cardElement = elements.getElement(CardElement);
    
    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        if (isCartCheckout) {
          // Create deliveries for all items in the cart
          await Promise.all(cartItems.map(item => 
            api.post('/deliveries', {
              bookId: item._id,
              transactionId: paymentIntent.id
            })
          ));
          clearCart();
        } else {
          // Single book delivery
          await api.post('/deliveries', {
            bookId: book._id,
            transactionId: paymentIntent.id
          });
        }
        
        toast.success('Order placed successfully!');
        navigate(`/dashboard/user`);
      }
    } catch (err) {
      toast.error('Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#1a1f36] mb-5">Payment Details</h2>
      <div className="p-4 border border-gray-200 rounded-xl mb-6">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}/>
      </div>
      
      <button 
        type="submit" 
        disabled={isProcessing || !stripe}
        className="w-full bg-brand text-white py-4 rounded-xl font-bold shadow-md shadow-brand/20 hover:bg-brand-deep transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <><ShieldCheck className="w-5 h-5" /> Pay ${(isCartCheckout ? totalAmount : (book.deliveryFee || 16.00)).toFixed(2)}</>
        )}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  
  const isCartCheckout = !bookId;
  const cartTotalAmount = location.state?.amount || 0;

  const [book, setBook] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initCheckout = async () => {
      try {
        if (isCartCheckout) {
          if (cartItems.length === 0 || cartTotalAmount === 0) {
            setLoading(false);
            return;
          }
          // Cart Checkout
          const paymentRes = await api.post('/payments/create-payment-intent', { 
            isCart: true,
            amount: cartTotalAmount
          });
          setClientSecret(paymentRes.data.clientSecret);
          setLoading(false);
        } else {
          // Single Book Checkout
          let bookData;
          if (bookId.startsWith('ol-') || bookId.startsWith('gb-')) {
            bookData = await getBookByExternalId(bookId);
          } else {
            const res = await api.get(`/books/${bookId}`);
            bookData = res.data.data;
          }
          setBook(bookData);

          const paymentRes = await api.post('/payments/create-payment-intent', { 
            bookId,
            amount: bookData.deliveryFee || 16.00
          });
          setClientSecret(paymentRes.data.clientSecret);
          setLoading(false);
        }
      } catch (err) {
        toast.error('Failed to load checkout');
        setLoading(false);
      }
    };
    
    initCheckout();
  }, [bookId, isCartCheckout, cartItems.length, cartTotalAmount]);

  if (isCartCheckout && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf9]">
        <h1 className="text-3xl font-display font-bold text-[#1a1f36] mb-4">Checkout Error</h1>
        <p className="text-gray-500 mb-8">Your cart is empty.</p>
        <Link to="/browse" className="bg-brand text-white px-6 py-2.5 rounded-full font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf9]">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf9] min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-[800px] mx-auto">
        <Link to={isCartCheckout ? "/cart" : `/books/${bookId}`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to {isCartCheckout ? 'Cart' : 'Book'}
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1a1f36] mb-10">Checkout</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               {isCartCheckout ? (
                 <>
                   <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                   <p className="text-sm text-gray-600 mb-2">{cartItems.length} items in cart</p>
                   <p className="text-brand font-bold mt-4 text-xl">Total: ${cartTotalAmount.toFixed(2)}</p>
                 </>
               ) : (
                 <>
                   <img src={book?.coverImage || '/default-book.png'} alt={book?.title} className="w-full h-auto rounded-lg mb-4 object-cover" />
                   <h3 className="font-bold text-lg">{book?.title}</h3>
                   <p className="text-brand font-bold mt-2">Delivery Fee: ${(book?.deliveryFee || 16.00).toFixed(2)}</p>
                 </>
               )}
            </div>
          </div>
          <div className="md:w-2/3">
             {clientSecret && (
               <Elements stripe={stripePromise} options={{ clientSecret }}>
                 <CheckoutForm 
                    book={book} 
                    clientSecret={clientSecret} 
                    isCartCheckout={isCartCheckout}
                    cartItems={cartItems}
                    totalAmount={cartTotalAmount}
                    clearCart={clearCart}
                 />
               </Elements>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
