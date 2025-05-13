import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';

import App from '@/App';

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
} from '@/Pages';

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
    Members,
    Settings,
    Chat,
} from '@/Components';

import { ChannelContextProvider } from '@/Context/ChannelContext';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="post/:postId" element={<PostPage />} />
            <Route path="followers" element={<FollowersPage />} />
            <Route path="history" element={<WatchHistoryPage />} />
            <Route path="liked" element={<LikedPostsPage />} />
            <Route path="saved" element={<SavedPostsPage />} />
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

            {/* protected routes */}
            <Route element={<Redirect path="/login" />}>
                <Route path="add" element={<AddPostPage />} />
                <Route path="update/:postId" element={<UpdatePostPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="settings/" element={<SettingsPage />}>
                    <Route path="" element={<UpdateAccountDetails />} />
                    <Route path="channel" element={<UpdateChannelDetails />} />
                    <Route path="password" element={<UpdatePassword />} />
                    <Route path="delete-account" element={<DeleteAccount />} />
                </Route>
                <Route path="chat" element={<ChatsPage />}>
                    <Route path="" element={<NoChatSelected />} />
                    <Route path=":chatId" element={<ChatLayout />}>
                        <Route path="" element={<Chat />} />
                        <Route path="details" element={<Details />}>
                            <Route path="" element={<Settings />} />
                            <Route path="members" element={<Members />} />
                        </Route>
                    </Route>
                </Route>
            </Route>

            {/* static pages */}
            <Route path="support" element={<SupportPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="faqs" element={<FAQpage />} />
            <Route path="server-error" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);
