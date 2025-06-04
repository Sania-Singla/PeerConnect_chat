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
    ServerErrorPage,
    NotFoundPage,
    SettingsPage,
    SupportPage,
    Redirect,
    AddPostPage,
    AdminPage,
    UpdatePostPage,
    AboutUsPage,
    ContactUsPage,
    FAQpage,
    ChatsPage,
    ProjectsPage,
    EditorPage,
    TopicsPage,
    QuestionsPage,
    BotPage,
    InterviewPage,
    ResumePage,
} from '@/Pages';

import {
    DeleteAccount,
    UpdateAccountDetails,
    UpdateChannelDetails,
    UpdatePassword,
    ChannelAbout,
    ChannelPosts,
    ChannelSavedPosts,
    ChannelLikedPosts,
    ChannelProjects,
    ChatLayout,
    ProjectLayout,
    Details,
    NoChatSelected,
    Members,
    Settings,
    Chat,
    ProjectDetail,
    QuestionLayout,
    ProjectRequests,
    ProjectTasks,
    ProjectContributors,
    ProjectContributionForm,
    QuestionDescription,
    QuestionEditorial,
    QuestionSubmissions,
    QuestionSolutions,
    QuestionDiscuss,

    // interview components
    InterviewDetails,
    Home,
    Feedback,
    EditorLayout,
    Form,
} from '@/Components';

import { ChannelContextProvider } from '@/Context';

import ViewResume from '@/Components/Resume/ViewResume';
import AddResume from '@/Components/Resume/resume/AddResume';
import EditResume from '@/Components/Resume/resume/EditResume';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="post/:postId" element={<PostPage />} />

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
                <Route path="saved-posts" element={<ChannelSavedPosts />} />
                <Route path="liked-posts" element={<ChannelLikedPosts />} />
                <Route path="projects" element={<ChannelProjects />} />
            </Route>

            <Route path="editor/" element={<EditorPage />}>
                <Route path="" element={<Form />} />
                <Route path=":roomId" element={<EditorLayout />} />
            </Route>

            <Route path="interview/" element={<InterviewPage />}>
                <Route path="" element={<Home />} />
                <Route path=":id" element={<InterviewDetails />} />
                <Route path=":id/feedback" element={<Feedback />} />
            </Route>

            <Route path="bot" element={<BotPage />} />

            <Route path="resume/" element={<ResumePage />}>
                <Route path="" element={<AddResume />} />
                <Route path=":resumeId/view" element={<ViewResume />} />
                <Route path=":resumeId/edit" element={<EditResume />} />
            </Route>

            <Route path="practice" element={<TopicsPage />} />
            <Route path="questions/:topicId" element={<QuestionsPage />} />
            <Route
                path="question/:topicId/:questionId"
                element={<QuestionLayout />}
            >
                <Route path="" element={<QuestionDescription />} />
                <Route path="editorial" element={<QuestionEditorial />} />
                <Route path="submissions" element={<QuestionSubmissions />} />
                <Route path="solutions" element={<QuestionSolutions />} />
                <Route path="discuss" element={<QuestionDiscuss />} />
            </Route>

            <Route path="projects" element={<ProjectsPage />} />
            <Route path="project/:projectId" element={<ProjectLayout />}>
                <Route path="" element={<ProjectDetail />} />
                <Route path="tasks" element={<ProjectTasks />} />
                <Route path="requests" element={<ProjectRequests />} />
                <Route path="contributors" element={<ProjectContributors />} />
                <Route
                    path="contribution-form"
                    element={<ProjectContributionForm />}
                />
            </Route>

            {/* protected routes */}
            <Route element={<Redirect path="/login" />}>
                <Route path="add" element={<AddPostPage />} />
                <Route path="update/:postId" element={<UpdatePostPage />} />
                {/* <Route path="dashboard" element={<AdminPage />} /> */}
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
