import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
    const [search, setSearch] = useState('');

    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

const useSearchContext = () => useContext(SearchContext);

export { useSearchContext, SearchContextProvider };
