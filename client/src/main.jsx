import { createRoot } from 'react-dom/client';
import './Styles/index.css';
import './Styles/resume.css';

import { RouterProvider } from 'react-router-dom';
import {
    UserContextProvider,
    PopupContextProvider,
    SideBarContextProvider,
    SearchContextProvider,
    SocketContextProvider,
    ChatContextProvider,
    ResumeContextProvider,
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
                                <ResumeContextProvider>
                                    <RouterProvider router={router} />
                                </ResumeContextProvider>
                            </SearchContextProvider>
                        </SideBarContextProvider>
                    </PopupContextProvider>
                </SocketContextProvider>
            </ChatContextProvider>
        </UserContextProvider>
    );
}

const container = document.getElementById('root');

// Ensure createRoot is only called once
if (!container._reactRoot) container._reactRoot = createRoot(container);

container._reactRoot.render(<Wrapper />);
