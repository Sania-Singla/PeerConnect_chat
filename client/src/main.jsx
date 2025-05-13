import { createRoot } from 'react-dom/client';
import './Styles/index.css';

import { RouterProvider } from 'react-router-dom';

import {
    UserContextProvider,
    PopupContextProvider,
    SideBarContextProvider,
    SearchContextProvider,
    SocketContextProvider,
    ChatContextProvider,
} from '@/Context';

import { router } from '@/Router';

function Wrapper() {
    return (
        <UserContextProvider>
            <ChatContextProvider>
                <SocketContextProvider>
                    <PopupContextProvider>
                        <SideBarContextProvider>
                            <SearchContextProvider>
                                <RouterProvider router={router} />
                            </SearchContextProvider>
                        </SideBarContextProvider>
                    </PopupContextProvider>
                </SocketContextProvider>
            </ChatContextProvider>
        </UserContextProvider>
    );
}

createRoot(document.getElementById('root')).render(<Wrapper />);
