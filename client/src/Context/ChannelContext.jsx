import { createContext, useContext, useState } from 'react';

const ChannelContext = createContext();

const ChannelContextProvider = ({ children }) => {
    const [channel, setChannel] = useState(null);

    return (
        <ChannelContext.Provider value={{ channel, setChannel }}>
            {children}
        </ChannelContext.Provider>
    );
};

const useChannelContext = () => useContext(ChannelContext);

export { useChannelContext, ChannelContextProvider };
