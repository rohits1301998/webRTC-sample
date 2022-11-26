import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useWebRTC } from './useWebRTC';

function App() {
  const { sendMessage } = useWebRTC();  
  return (
    <div className="App">
      <button onClick={() => sendMessage("Hello test message!")}>Send message</button>
    </div>
  );
}

export default App;
