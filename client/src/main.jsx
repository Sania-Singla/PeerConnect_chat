// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './Styles/index.css';

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    useNavigate,
} from 'react-router-dom';

import {
    LoginPage,
    HomePage,
    RegisterPage,
    PostPage,
    ChannelPage,
    FollowersPage,
    ServerErrorPage,
    NotFoundPage,
    SettingsPage,
    SupportPage,
    Redirect,
    WatchHistoryPage,
    LikedPostsPage,
    AddPostPage,
    AdminPage,
    UpdatePostPage,
    SavedPostsPage,
    AboutUsPage,
    ContactUsPage,
    FAQpage,
    ChatsPage,
} from './Pages';

import {
    UserContextProvider,
    ChannelContextProvider,
    PopupContextProvider,
    SideBarContextProvider,
    SearchContextProvider,
    SocketContextProvider,
    ChatContextProvider,
} from './Context';

import {
    DeleteAccount,
    UpdateAccountDetails,
    UpdateChannelDetails,
    UpdatePassword,
    ChannelAbout,
    ChannelPosts,
    ChatLayout,
    Details,
    NoChatSelected,
    Overview,
    Members,
    Settings,
} from './Components';

function Wrapper() {
    const navigate = useNavigate();

    return (
        <UserContextProvider>
            <ChatContextProvider>
                <SocketContextProvider navigate={navigate}>
                    <PopupContextProvider>
                        <SideBarContextProvider>
                            <SearchContextProvider>
                                <App />
                            </SearchContextProvider>
                        </SideBarContextProvider>
                    </PopupContextProvider>
                </SocketContextProvider>
            </ChatContextProvider>
        </UserContextProvider>
    );
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Wrapper />}>
            <Route path="" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="post/:postId" element={<PostPage />} />
            <Route path="followers" element={<FollowersPage />} />
            <Route path="history" element={<WatchHistoryPage />} />
            <Route path="liked" element={<LikedPostsPage />} />
            <Route path="saved" element={<SavedPostsPage />} />
            <Route path="chat" element={<ChatsPage />}>
                <Route path="" element={<NoChatSelected />} />
                <Route path=":chatId" element={<ChatLayout />}>
                    <Route path="details" element={<Details />}>
                        <Route path="" element={<Overview />} />
                        <Route path="members" element={<Members />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>
            </Route>

            {/* static pages */}
            <Route path="support" element={<SupportPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="faqs" element={<FAQpage />} />
            <Route path="server-error" element={<ServerErrorPage />} />

            {/* protected routes */}
            <Route
                path="add"
                element={
                    <Redirect path="/login">
                        <AddPostPage />
                    </Redirect>
                }
            />
            <Route
                path="update/:postId"
                element={
                    <Redirect path="/login">
                        <UpdatePostPage />
                    </Redirect>
                }
            />
            <Route
                path="admin"
                element={
                    <Redirect path="/login">
                        <AdminPage />
                    </Redirect>
                }
            />

            {/* settings page */}
            <Route
                path="settings/"
                element={
                    <Redirect path="/login">
                        <SettingsPage />
                    </Redirect>
                }
            >
                <Route path="" element={<UpdateAccountDetails />} />
                <Route path="channel" element={<UpdateChannelDetails />} />
                <Route path="password" element={<UpdatePassword />} />
                <Route path="delete-account" element={<DeleteAccount />} />
            </Route>

            {/* channel page */}
            <Route
                path="channel/:userId"
                element={
                    <ChannelContextProvider>
                        <ChannelPage />
                    </ChannelContextProvider>
                }
            >
                <Route path="" element={<ChannelPosts />} />
                <Route path="about" element={<ChannelAbout />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <RouterProvider router={router} />
    // </StrictMode>,
);
