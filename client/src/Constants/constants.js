const LIMIT = 10;
const DEFAULT_RTE_TEXT = 'Welcome to Post Manager ⭐';
const MAX_FILE_SIZE = 5;
const BASE_BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL + '/api';
const SERVER_ERROR = 500;
const BAD_REQUEST = 400;

const CONTACTS = {
    email: 'peerconnect@gmail.com',
    phone: 'xxxxxxxxxx',
};

const TAILWIND_COLORS = [
    'text-blue-600',
    'text-teal-600',
    'text-indigo-600',
    'text-purple-600',
    'text-pink-600',
    'text-rose-600',
    'text-yellow-600',
    'text-green-600',
    'text-emerald-600',
    'text-cyan-600',
];

const IMAGES = {
    user: 'https://res.cloudinary.com/dddnbyltc/image/upload/v1741966812/aggldxme6x3lszagjypr.png',
    logo: '/images/logo.jpg',
    logoSvg: '/images/logo_without_bg.png',
    tech: '/images/tech.svg',
    robot: '/images/robot.png',
    resume: '/images/resume.png',
    resumeCover: '/images/resumeCover.png',
    contributors: {
        sania: '/images/sania.jpg',
        vasundhra: '/images/vasundhra.jpg',
        seerat: '/images/seerat.jpg',
    },
    companies: [
        '/images/companies/adobe.png',
        '/images/companies/amazon.png',
        '/images/companies/facebook.png',
        '/images/companies/hostinger.png',
        '/images/companies/pinterest.png',
        '/images/companies/quora.png',
        '/images/companies/reddit.png',
        '/images/companies/skype.png',
        '/images/companies/spotify.png',
        '/images/companies/telegram.png',
        '/images/companies/tiktok.png',
        '/images/companies/yahoo.png',
    ],
};

const RESUME_THEMES = [
    '#333333', // dark gray (instead of black)
    '#E06A4A', // warm coral
    '#6BA46B', // fresh green
    '#658CCF', // steel blue lighter
    '#B66B93', // soft pinkish mauve
    '#7F63B8', // moderate violet
    '#8CAC51', // olive green brighter
    '#A7BC44', // lively chartreuse
    '#4CA8BF', // turquoise bright
    '#D0616E', // muted red
];

const CONTRIBUTORS = [
    {
        image: IMAGES.contributors.sania,
        role: 'Lead Developer',
        bio: 'Visionary Full Stack Developer crafting impactful, real-world solutions with precision and purpose.',
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
        image: IMAGES.contributors.vasundhra,
        role: 'Full Stack Developer',
        bio: 'Innovative full stack developer specializing in smart bots and scalable systems that solve real-world problems.',
        name: 'Vasundhra Gupta',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/vasundhra-gupta-764713291',
            discord: '',
            gitHub: 'https://github.com/Vasundhra-Gupta',
            threads: '',
            instagram: 'https://www.instagram.com/vasundhragupta962',
        },
    },
    {
        image: IMAGES.contributors.seerat,
        role: 'Aspiring Full-Stack Developer',
        bio: 'Passionate about coding and building real-world projects with a strong foundation in Java, C++, HTML, CSS , js.',
        name: 'Seerat Grover',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/seerat-grover-105233344 ',
            discord: '',
            gitHub: 'https://github.com/Grover-Seerat',
            threads: '',
            instagram: '',
        },
    },
];

const LANGUAGES = {
    python3: {
        label: 'Python',
        mode: 'python',
        boilerplate: `
def main():
    # your code goes here
    pass

if __name__ == "__main__":
    main()
        `.trim(),
    },
    java: {
        label: 'Java',
        mode: 'text/x-java',
        boilerplate: `
public class Main {
    public static void main(String[] args) {
        // your code goes here
    }
}
        `.trim(),
    },
    cpp: {
        label: 'C++',
        mode: 'text/x-c++src',
        boilerplate: `
#include <iostream>
int main() {
    // your code goes here
    return 0;
}
        `.trim(),
    },
    javascript: {
        label: 'JavaScript',
        mode: 'javascript',
        boilerplate: `
function main() {
    // your code goes here
}

main();
        `.trim(),
    },
    c: {
        label: 'C',
        mode: 'text/x-csrc',
        boilerplate: `
#include <stdio.h>
int main() {
    // your code goes here
    return 0;
}
        `.trim(),
    },
};

export {
    LIMIT,
    BASE_BACKEND_URL,
    DEFAULT_RTE_TEXT,
    SERVER_ERROR,
    BAD_REQUEST,
    MAX_FILE_SIZE,
    CONTRIBUTORS,
    CONTACTS,
    TAILWIND_COLORS,
    IMAGES,
    LANGUAGES,
    RESUME_THEMES,
};
