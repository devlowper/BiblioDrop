import React, { useEffect } from 'react';

const AdminInfo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-[70vh] flex items-center justify-center py-20 px-4 md:px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-xl">
        <h1 className="font-display font-bold text-3xl text-center text-[#1a1f36] mb-8">Project Details</h1>
        
        <div className="space-y-6">
          <div className="p-5 bg-[#f8f8f8] rounded-2xl border border-gray-100">
            <h2 className="font-bold text-lg text-[#1a1f36] mb-4">Admin Credentials</h2>
            <div className="space-y-3 text-[15px]">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-200 pb-3">
                <span className="text-gray-500 font-medium">Admin Email:</span>
                <span className="font-bold text-[#ff7b6b]">admin@gmail.com</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-1">
                <span className="text-gray-500 font-medium">Admin Password:</span>
                <span className="font-mono bg-white px-3 py-1 rounded border border-gray-200 font-bold text-[#1a1f36] shadow-sm text-sm">Admin@123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
