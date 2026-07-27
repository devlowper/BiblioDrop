import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf9]">
        <h1 className="text-3xl font-display font-bold text-[#1a1f36] mb-4">Checkout</h1>
        <p className="text-gray-500 mb-8">Your cart is empty. Add items before checking out.</p>
        <Link to="/browse" className="bg-brand text-white px-6 py-2.5 rounded-full font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call and order placement
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      const mockOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      toast.success('Order placed successfully!');
      navigate(`/track/${mockOrderId}`);
    }, 2000);
  };

  return (
    <div className="bg-[#fcfaf9] min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1a1f36] mb-10">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Checkout Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              
              {/* Contact Info */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-[#1a1f36] mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm">1</span> 
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input required type="text" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input required type="text" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input required type="email" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="john@example.com" />
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-10 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-[#1a1f36] mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm">2</span> 
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                    <input required type="text" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="123 Main St" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input required type="text" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                    <input required type="text" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="10001" />
                  </div>
                </div>
              </div>

              {/* Payment Method (Simulated) */}
              <div className="pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-[#1a1f36] mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm">3</span> 
                  Payment details
                </h2>
                <div className="p-4 rounded-xl border-2 border-brand bg-brand/5 flex items-start gap-4 mb-5">
                  <div className="mt-1">
                    <div className="w-5 h-5 rounded-full border-[5px] border-brand bg-white"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1f36] flex items-center gap-2">Credit Card <CreditCard className="w-4 h-4 text-brand" /></h3>
                    <p className="text-sm text-gray-500 mt-1">Simulated payment for demonstration.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-70 pointer-events-none">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                    <input readOnly type="text" value="•••• •••• •••• 4242" className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                    <input readOnly type="text" value="12/28" className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVC</label>
                    <input readOnly type="text" value="123" className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50" />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-brand text-white py-4 rounded-xl font-bold shadow-md shadow-brand/20 hover:bg-brand-deep transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" /> Place Order • ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-display font-bold text-[#1a1f36] mb-6">In your cart</h2>
              
              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-20 rounded bg-gray-100 overflow-hidden shrink-0">
                      <img src={item.coverImage || '/default-book.png'} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a1f36] text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#1a1f36] mt-1">${((item.deliveryFee || 10.99) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 text-sm mb-6 pb-6 border-y border-gray-100 pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-[#1a1f36]">Total</span>
                <span className="text-2xl font-bold text-brand">${total.toFixed(2)}</span>
              </div>

              <div className="bg-brand-ink/50 p-4 rounded-xl flex items-start gap-3 border border-brand/10">
                <Truck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your order will be processed immediately. Estimated delivery within 2-3 business days.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
