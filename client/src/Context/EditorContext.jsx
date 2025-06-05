import { createContext, useContext, useState } from 'react';

const EditorContext = createContext();

const EditorContextProvider = ({ children }) => {
    const [coders, setCoders] = useState(null);

    return (
        <EditorContext.Provider value={{ coders, setCoders }}>
            {children}
        </EditorContext.Provider>
    );
};

const useEditorContext = () => useContext(EditorContext);

export { useEditorContext, EditorContextProvider };
