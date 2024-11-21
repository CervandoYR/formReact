import React from 'react';
import Home from './views/Home';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider> 
      <Home />
    </ThemeProvider>
  );
}

export default App;
