import React, { createContext, useState, useContext } from 'react';


const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading deve ser usado dentro de um LoadingProvider');
    }
    return context;
}