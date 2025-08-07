import React from "react";

const Loader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-gray-200"></div>
  </div>
);

export default Loader;
