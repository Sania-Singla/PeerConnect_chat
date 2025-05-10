const LIMIT = 10;
const DEFAULT_RTE_TEXT = 'Welcome to Post Manager ⭐';
import SANIAIMAGE from '../Assets/images/sania.jpg';
import VASUNDHRAIMAGE from '../Assets/images/vasundhra.jpg';
import LOGO from '../Assets/images/logo.jpg';
const EMAIL = 'peerconnect@gmail.com';
const CONTACTNUMBER = 'xxxxxxxxxx';
const MAX_FILE_SIZE = 5;

const BASE_BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL + '/api';
const SERVER_ERROR = 500;
const BAD_REQUEST = 400;

const TAILWIND_COLORS = [
    'text-blue-500',
    'text-teal-500',
    'text-indigo-500',
    'text-purple-500',
    'text-pink-500',
    'text-rose-500',
    'text-yellow-500',
    'text-green-500',
    'text-emerald-500',
    'text-cyan-500',
];

const CONTRIBUTORS = [
    {
        image: SANIAIMAGE,
        role: 'Lead Developer',
        bio: 'Full-stack developer passionate about creating beautiful, scalable applications',
        name: 'Sania Singla',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/sania-singla',
            discord: 'https://discord.com/channels/@sania_singla',
            gitHub: 'https://github.com/Sania-Singla',
            threads: 'https://x.com/sania_singla',
            instagram: 'https://www.instagram.com/sania__singla',
        },
    },
    {
        image: VASUNDHRAIMAGE,
        role: 'Modularity Handler',
        bio: 'Breaking big ideas into small, reusable components.',
        name: 'Vasundhra Gupta',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/vasundhra-gupta-764713291',
            discord: '',
            gitHub: 'https://github.com/Vasundhra-Gupta',
            threads: '',
            instagram: 'https://www.instagram.com/vasundhragupta962',
        },
    },
];

export {
    LIMIT,
    BASE_BACKEND_URL,
    DEFAULT_RTE_TEXT,
    LOGO,
    SERVER_ERROR,
    BAD_REQUEST,
    MAX_FILE_SIZE,
    CONTRIBUTORS,
    EMAIL,
    CONTACTNUMBER,
    TAILWIND_COLORS,
};
