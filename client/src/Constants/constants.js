const LIMIT = 10;
const DEFAULT_RTE_TEXT = 'Welcome to Post Manager ⭐';
import SANIAIMAGE from '../Assets/images/sania.jpg';
import VASUNDHRAIMAGE from '../Assets/images/vasundhra.jpg';
import VANSHIKAIMAGE from '../Assets/images/vanshika.jpg';
import ROMILIMAGE from '../Assets/images/romil.jpg';
import SHIPRAIMAGE from '../Assets/images/shipra.jpg';
import LOGO from '../Assets/images/logo.jpg';
const EMAIL = 'peerconnect@gmail.com';
const CONTACTNUMBER = 'xxxxxxxxxx';

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
            instagram: '',
        },
    },
    {
        image: VANSHIKAIMAGE,
        role: 'Database Automator',
        bio: 'Automating database tasks to keep things running smoothly.',
        name: 'Vanshika Dhariya',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/vanshika-dhariya-486a872b1',
            discord: '',
            gitHub: 'https://github.com/vanshika-1136',
            threads: '',
            instagram: '',
        },
    },
    {
        image: ROMILIMAGE,
        role: 'Database Performance Analyst',
        bio: 'Optimizing databases for faster, better performance.',
        name: 'Vanshika Dhariya',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/romil-kumar-842a55282',
            discord: '',
            gitHub: 'https://github.com/RomilKumar',
            threads: '',
            instagram: '',
        },
    },
    {
        image: SHIPRAIMAGE,
        role: 'Schema Architect',
        bio: 'Designing clean, efficient database schemas.',
        name: 'Vanshika Dhariya',
        socials: {
            linkedIn: 'https://www.instagram.com/shipra_goyal_01',
            discord: '',
            gitHub: 'https://github.com/shipranaman',
            threads: '',
            instagram: '',
        },
    },
];

export { LIMIT, DEFAULT_RTE_TEXT, LOGO, CONTRIBUTORS, EMAIL, CONTACTNUMBER };
