import React from 'react';
import './App.css';
import Background from './components/Background/Background'; 
import Navigation from './components/Navigation/Navigation'; 
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';

function App() {
  return (
    <div className="App">
      <Background />
      <Navigation />
      <Logo />
      <ImageLinkForm />
    </div>
  );
}

export default App;
