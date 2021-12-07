import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css'; 
import App from './App';
import { AudioProvider } from './contexts/AudioContext'
import tracklistData from './tracklistData.json'

ReactDOM.render(
  <React.StrictMode>
    <AudioProvider value={tracklistData}>
      <App />
    </AudioProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
