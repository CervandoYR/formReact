import React, { createContext, useState, useContext } from 'react';


// Este contexto es para compartir el estado del tema entre los demas components
const ThemeContext = createContext();

// gestionar el estado del tema para los otros componentes
export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem('theme') === 'dark';

  const [isDarkMode, setIsDarkMode] = useState(savedTheme);

  // Función para alternar entre tema claro y oscuro
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Guardar el nuevo modo en localStorage para persistir la preferencia del usuario
      localStorage.setItem('theme', newMode ? 'dark' : 'light');

      return newMode;
    });
  };

  // Proveer los valores del contexto 
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// hook personalizado para acceder al contexto
export const useTheme = () => useContext(ThemeContext);
