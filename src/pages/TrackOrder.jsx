import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, Clock, ArrowLeft, MapPin } from 'lucide-react';

const TrackOrder = () => {
  const { orderId } = useParams();

  // Simulated order data
  const orderDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const steps = [
    { title: 'Order Placed', description: orderDate, icon: Package, completed: true, current: false },
    { title: 'Processing', description: 'We are preparing your items', icon: Clock, completed: true, current: true },
    { title: 'Shipped', description: 'Handed over to delivery partner', icon: Truck, completed: false, current: false },
    { title: 'Delivered', description: `Estimated by ${deliveryDate}`, icon: CheckCircle, completed: false, current: false }
  ];

  return (
    <div className="bg-[#fcfaf9] min-h-[85vh] py-12 px-4 md:px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1a1f36] mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for your purchase.</p>
          <div className="mt-4 py-2 px-4 bg-gray-50 rounded-lg inline-block border border-gray-200 text-sm font-medium text-gray-700">
            Order ID: <span className="text-brand font-bold">{orderId}</span>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-[#1a1f36] mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand" /> Tracking Details
          </h3>
          
          <div className="relative border-l-2 border-gray-100 ml-6 space-y-8 pb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative pl-8">
                  <div className={`absolute -left-[17px] w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${
                    step.completed ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${step.completed ? 'text-[#1a1f36]' : 'text-gray-400'}`}>
                      {step.title}
                      {step.current && <span className="ml-2 text-[10px] uppercase tracking-wider bg-brand/10 text-brand px-2 py-0.5 rounded-full">Current Status</span>}
                    </h4>
                    <p className={`text-xs mt-1 ${step.completed ? 'text-gray-500' : 'text-gray-400'}`}>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/browse" className="flex-1 bg-brand text-white py-3.5 rounded-xl font-bold shadow-md shadow-brand/20 hover:bg-brand-deep transition-colors text-center">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
