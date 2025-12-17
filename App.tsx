import React from 'react';
import { FeeCalculator } from './components/FeeCalculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 
        This wrapper simulates the 'host' page where the widget might be embedded. 
        The widget itself is self-contained within FeeCalculator.
      */}
      <div className="w-full max-w-lg">
        <FeeCalculator />
      </div>
    </div>
  );
};

export default App;