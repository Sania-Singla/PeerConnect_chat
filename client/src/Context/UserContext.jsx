import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loginStatus, setLoginStatus] = useState(false);

    return (
        <UserContext.Provider
            value={{ user, setUser, loginStatus, setLoginStatus }}
        >
            {children}
        </UserContext.Provider>
    );
};

function useUserContext() {
    return useContext(UserContext);
}

export { useUserContext, UserContextProvider };
