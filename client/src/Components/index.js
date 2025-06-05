// Layout components
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Layout from './Layout/Layout';
import Sidebar from './Layout/Sidebar';
import SmallSidebar from './Layout/SmallSidebar';

// General components
import RTE from './General/RTE';
import Button from './General/Button';
import ContributorCard from './General/ContributorCard';

// Auth components
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import DeleteAccount from './Auth/DeleteAccount';

// User components
import UpdateAvatar from './User/UpdateAvatar';
import UpdatePassword from './User/UpdatePassword';
import UpdateCoverImage from './User/UpdateCoverImage';
import UpdateAccountDetails from './User/UpdateAccountDetails';
import UpdateChannelDetails from './User/UpdateChannelDetails';

// Post components
import AdminPostRow from './Post/AdminPostRow';
import PostCardView from './Post/PostCardView';
import PostListView from './Post/PostListView';
import LikedPostView from './Post/LikedPostView';
import SavedPostView from './Post/SavedPostView';
import Recemendations from './Post/Recemendations';

// Channel components
import ChannelAbout from './Channel/ChannelAbout';
import ChannelPosts from './Channel/ChannelPosts';
import ChannelLikedPosts from './Channel/ChannelLikedPosts';
import ChannelSavedPosts from './Channel/ChannelSavedPosts';
import ChannelProjects from './Channel/ChannelProjects';

// Comment components
import Comment from './Comment/Comment';
import Comments from './Comment/Comments';

// Chats components
import Chat from './Chats/Chat';
import Message from './Chats/Message';
import Details from './Chats/Detail/Details';
import Members from './Chats/Detail/Members';
import Settings from './Chats/Detail/Settings';
import FilePreview from './Chats/FilePreview';
import ChatInput from './Chats/Layout/ChatInput';
import ChatNavbar from './Chats/Layout/ChatNavbar';
import ChatLayout from './Chats/Layout/ChatLayout';
import ChatHeader from './Chats/Layout/ChatHeader';
import ChatSidebar from './Chats/Layout/ChatSidebar';
import NoChatSelected from './Chats/NoChatSelected';
import ChatSettings from './Chats/Detail/ChatSettings';
import GroupSettings from './Chats/Detail/GroupSettings';
import InputFilePreview from './Chats/InputFilePreview';

// Popups
import Popup from './Popups/Popup';
import LoginPopup from './Popups/LoginPopup';
import CustomToast from './Popups/CustomToast';
import FriendsPopup from './Popups/FriendsPopup';
import RequestsPopup from './Popups/RequestsPopup';
import ShowFilePopup from './Popups/ShowFilePopup';
import AddMembersPopup from './Popups/AddMembersPopup';
import UpdateAvatarPopup from './Popups/UpdateAvatarPopup';
import DeleteAccountPopup from './Popups/DeleteAccountPopup';
import UpdateCoverImagePopup from './Popups/UpdateCoverImagePopup';
import NewResumePopup from './Popups/NewResumePopup';
import DeleteResumePopup from './Popups/DeleteResumePopup';
import ResumeThemePopup from './Popups/ResumeThemePopup';

// Project components
import ProjectCard from './Project/ProjectCard';
import ProjectDetail from './Project/ProjectDetail';
import ProjectHeader from './Project/ProjectHeader';
import ProjectLayout from './Project/ProjectLayout';
import ProjectTasks from './Project/ProjectTasks';
import ProjectContributionForm from './Project/ProjectContributionForm';
import ProjectContributors from './Project/ProjectContributors';
import ProjectRequests from './Project/ProjectRequests';

// Practice components
import QuestionCard from './Practice/QuestionCard';
import TopicCard from './Practice/TopicCard';
import QuestionDescription from './Practice/Layout/QuestionDescription';
import QuestionDiscuss from './Practice/Layout/QuestionDiscuss';
import QuestionEditorial from './Practice/Layout/QuestionEditorial';
import QuestionLayout from './Practice/Layout/QuestionLayout';
import QuestionSolutions from './Practice/Layout/QuestionSolution';
import QuestionSubmissions from './Practice/Layout/QuestionSubmissions';
import QuestionEditor from './Practice/Layout/QuestionEditor';
import QuestionHeader from './Practice/Layout/QuestionHeader';

// Editor components
import Editor from './Editor/Editor';
import EditorLayout from './Editor/EditorLayout';
import Form from './Editor/Form';

// Resume components
import PersonalInfoForm from './Resume/Forms/PersonalInfoForm';
import EducationForm from './Resume/Forms/EducationForm';
import ExperienceForm from './Resume/Forms/ExperienceForm';
import SkillsForm from './Resume/Forms/SkillsForm';
import AchievementsForm from './Resume/Forms/AchievementsForm';
import SummaryForm from './Resume/Forms/SummaryForm';

import ResumeCardItem from './Resume/Previews/ResumeCardItem';
import ResumePreview from './Resume/Previews/ResumePreview';
import PersonalInfoPreview from './Resume/Previews/PersonalInfoPreview';
import EducationPreview from './Resume/Previews/EducationPreview';
import ExperiencePreview from './Resume/Previews/ExperiencePreview';
import SkillsPreview from './Resume/Previews/SkillsPreview';
import AchievementsPreview from './Resume/Previews/AchievementsPreview';
import SummaryPreview from './Resume/Previews/SummaryPreview';

// Interview components
import Home from './Interview/Pages/Home';
import InterviewDetails from './Interview/Pages/InterviewDetails';
import Agent from './Interview/Components/Agent';
import InterviewCard from './Interview/Components/InterviewCard';
import DisplayTechIcons from './Interview/Components/DisplayTechIcons';
import Feedback from './Interview/Pages/Feedback';

export {
    Header,
    Footer,
    Sidebar,
    SmallSidebar,
    Layout,
    Button,
    RTE,
    ContributorCard,
    LoginPopup,
    DeleteAccountPopup,
    UpdateAvatarPopup,
    UpdateCoverImagePopup,
    DeleteAccount,
    Logout,
    Login,
    UpdateAccountDetails,
    UpdateChannelDetails,
    UpdatePassword,
    UpdateAvatar,
    UpdateCoverImage,
    PostCardView,
    PostListView,
    Recemendations,
    AdminPostRow,
    ProjectContributors,
    NewResumePopup,
    ChannelAbout,
    ProjectContributionForm,
    ChannelPosts,
    Comment,
    Comments,
    LikedPostView,
    SavedPostView,
    Popup,
    ShowFilePopup,
    AddMembersPopup,
    CustomToast,
    ChatHeader,
    ChatSidebar,
    ChatNavbar,
    ProjectRequests,
    ChatInput,
    Chat,
    ChatLayout,
    Message,
    FilePreview,
    ResumeThemePopup,
    DeleteResumePopup,
    NoChatSelected,
    InputFilePreview,
    Details,
    ChatSettings,
    GroupSettings,
    Members,
    Settings,
    FriendsPopup,
    RequestsPopup,
    ProjectCard,
    QuestionLayout,
    ProjectDetail,
    ProjectHeader,
    ProjectLayout,
    ProjectTasks,
    ChannelLikedPosts,
    ChannelProjects,
    ChannelSavedPosts,
    Editor,
    EditorLayout,
    Form,
    QuestionCard,
    TopicCard,
    QuestionDescription,
    QuestionDiscuss,
    QuestionEditorial,
    QuestionSolutions,
    QuestionSubmissions,
    QuestionEditor,
    QuestionHeader,
    ResumeCardItem,
    ResumePreview,
    PersonalInfoForm,
    EducationForm,
    ExperienceForm,
    SkillsForm,
    AchievementsForm,
    SummaryForm,
    PersonalInfoPreview,
    EducationPreview,
    ExperiencePreview,
    SkillsPreview,
    AchievementsPreview,
    SummaryPreview,

    // interview components
    Home,
    InterviewDetails,
    Agent,
    InterviewCard,
    DisplayTechIcons,
    Feedback,
};
