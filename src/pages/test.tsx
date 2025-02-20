import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Server Test Page</h1>
        <p className="mt-4 text-gray-600">If you can see this, the server is running correctly on port 4002</p>
        <p className="mt-2 text-sm text-gray-500">Server Info:</p>
        <pre className="mt-2 p-4 bg-gray-100 rounded">
          {`URL: ${window.location.href}
Port: ${window.location.port}
Protocol: ${window.location.protocol}`}
        </pre>
      </div>
    </div>
  );
};

export default TestPage;