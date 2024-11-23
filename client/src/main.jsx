import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './Styles/index.css';

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import {
    LoginPage,
    HomePage,
    RegisterPage,
    PostPage,
    ChannelPage,
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
    FollowersPage,
} from './Pages';

import { UserContextProvider } from './Context/UserContext';
import { ChannelContextProvider } from './Context/ChannelContext';
import { PopupContextProvider } from './Context/PopupContext';
import { SearchContextProvider } from './Context/SearchContext';

import {
    DeleteAccount,
    UpdateAccountDetails,
    UpdateChannelDetails,
    UpdatePassword,
    ChannelAbout,
    ChannelPosts,
} from './Components';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={
                <PopupContextProvider>
                    {/* because we are using useLocation() in this context which requires the component or the context provider to be inside a Router */}
                    <App />
                </PopupContextProvider>
            }
        >
            <Route path="" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="post/:postId" element={<PostPage />} />
            <Route path="history" element={<WatchHistoryPage />} />
            <Route path="liked" element={<LikedPostsPage />} />
            <Route path="saved" element={<SavedPostsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="followers" element={<FollowersPage />} />
            <Route path="faqs" element={<FAQpage />} />
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
            <Route
                path="channel/:userName"
                element={
                    <ChannelContextProvider>
                        <ChannelPage />
                    </ChannelContextProvider>
                }
            >
                <Route path="" element={<ChannelPosts />} />
                <Route path="about" element={<ChannelAbout />} />
            </Route>
            <Route path="server-error" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <UserContextProvider>
        <SearchContextProvider>
            <RouterProvider router={router} />
        </SearchContextProvider>
    </UserContextProvider>
    // </StrictMode>,
);
