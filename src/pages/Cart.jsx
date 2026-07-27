import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fcfaf9] px-4">
        <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-brand" />
        </div>
        <h1 className="text-3xl font-display font-bold text-[#1a1f36] mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added any books to your cart yet. Discover some amazing reads!</p>
        <Link 
          to="/browse"
          className="bg-brand text-white px-8 py-3.5 rounded-full font-semibold shadow-md shadow-brand/30 hover:bg-brand-deep transition-colors"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf9] min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1a1f36] mb-10">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-5 bg-gray-50/80 border-b border-gray-100 text-sm font-semibold text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const price = item.deliveryFee || 10.99;
                  return (
                    <div key={item._id} className="p-5 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-4 items-start sm:items-center">
                      
                      {/* Product Info */}
                      <div className="col-span-6 flex gap-4 w-full">
                        <div className="w-20 sm:w-24 aspect-[3/4] rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                          <img src={item.coverImage || '/default-book.png'} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col py-1">
                          <span className="text-xs font-semibold text-brand mb-1 uppercase tracking-wider">{item.category || 'Book'}</span>
                          <h3 className="font-bold text-[#1a1f36] text-sm sm:text-base leading-tight mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.author || 'Unknown Author'}</p>
                          <div className="sm:hidden mt-auto pt-2 font-bold text-[#1a1f36]">${price.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-3 flex justify-start sm:justify-center w-full">
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:shadow-sm transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:shadow-sm transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 hidden sm:block text-right font-bold text-[#1a1f36] text-lg">
                        ${(price * item.quantity).toFixed(2)}
                      </div>

                      {/* Remove */}
                      <div className="col-span-1 flex justify-end w-full sm:w-auto mt-2 sm:mt-0 absolute top-4 right-4 sm:relative sm:top-0 sm:right-0">
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <Link to="/browse" className="text-brand font-semibold hover:text-brand-deep text-sm flex items-center gap-1.5">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-display font-bold text-[#1a1f36] mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-[#1a1f36]">Total</span>
                <span className="text-2xl font-bold text-brand">${total.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-brand text-white py-4 rounded-xl font-bold shadow-md shadow-brand/20 hover:bg-brand-deep transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-6">
                Secure checkout. We accept all major credit cards.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
