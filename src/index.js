import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StarRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating />
    <StarRating size={24} color='red'/>
    <StarRating size={24} color='red' messages={['terrible', 'bad', 'ok', 'good', 'great']} defaultRating={3}/> */}
  </React.StrictMode>
);


