import React, { useState } from 'react';

const EnvironmentDetails = () => {
  const [accessMethod, setAccessMethod] = useState('');
  const [view, setView] = useState('');
  const [environmentTexture, setEnvironmentTexture] = useState('');

  return (
    <div className="relative w-5/6 h-5/6">
      <div className="overflow-auto scrollbar-thin max-h-[80vh] pr-2 w-full min-h-[70vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Access Method */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">شیوه دسترسی به اقامتگاه</label>
            <textarea
              value={accessMethod}
              onChange={(e) => setAccessMethod(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="شیوه دسترسی به اقامتگاه"
            />
          </div>

          {/* View */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">منظره اقامتگاه</label>
            <textarea
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="منظره اقامتگاه"
            />
          </div>

          {/* Environment Texture */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">بافت محیط</label>
            <input
              type="text"
              value={environmentTexture}
              onChange={(e) => setEnvironmentTexture(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="بافت محیط"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentDetails;
