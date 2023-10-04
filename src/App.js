// App.js
import React from 'react';
import Auth  from './Auth';
import CoinTransfer from './CoinTransfer';

const App = () => {
  return (
    <div>
      <h1>Your App</h1>
      < Auth />
      <CoinTransfer />
      {/* Other components or content for your application */}
    </div>
  );
};

export default App;
