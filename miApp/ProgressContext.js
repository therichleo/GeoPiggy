import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progreso, setProgreso] = useState(3000); // puedes iniciar desde 0 o desde almacenamiento si quieres

  return (
    <ProgressContext.Provider value={{ progreso, setProgreso }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
