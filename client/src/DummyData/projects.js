export const projects = [
    {
        projectId: 'p001',
        title: 'Smart Home Automation System',
        description:
            'An IoT-based home automation platform that allows users to control appliances, monitor energy usage, and set automation rules through a mobile app.',
        longDescription: `
  <div class="font-sans text-gray-700 leading-relaxed space-y-4">
    <p class="text-lg font-semibold ">Welcome to the future of intelligent living!</p>

    <p>
      This project delivers a cutting-edge <strong>Smart Home Solution</strong> that elevates comfort, efficiency, and security. With seamless cross-platform integration, it empowers users to automate and manage their homes effortlessly.
    </p>

    <p class="font-medium ">✨ Key Features:</p>
    <ul class="list-disc list-inside pl-4 space-y-1">
      <li><strong>Voice Control:</strong> Integrates with <em>Amazon Alexa</em> and <em>Google Assistant</em> for hands-free operations.</li>
      <li><strong>Energy Monitoring:</strong> Real-time insights into power usage help reduce energy bills.</li>
      <li><strong>Smart Automation:</strong> Customize triggers based on schedules, sensors, and external conditions.</li>
      <li><strong>Mobile App:</strong> React Native-powered app with smooth UX on Android & iOS.</li>
      <li><strong>Secure Access:</strong> Remotely control your home using encrypted connections.</li>
    </ul>

    <p class="font-semibold ">🛠️ Tech Stack:</p>
    <ul class="list-disc list-inside pl-4 space-y-1">
      <li><strong>Frontend:</strong> React Native</li>
      <li><strong>Backend:</strong> Node.js</li>
      <li><strong>IoT Devices:</strong> ESP32 microcontrollers</li>
    </ul>

    <p>
      Whether you're a tech enthusiast or a curious contributor, this project is a gateway into the evolving world of smart homes.
    </p>
  </div>
`,

        tags: [
            { name: 'IoT', color: '#E8F5E9' },
            { name: 'Home Automation', color: '#E3F2FD' },
            { name: 'Mobile App', color: '#FCE4EC' },
        ],
        githubLink: 'https://github.com/home-assistant',
        owner: {
            name: 'Michael Chen',
            email: 'michael.c@example.com',
            profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        chat: [],
        requests: [
            {
                id: 1,
                name: 'Sanya Malik',
                email: 'sanya.malik@example.com',
                profilelink: '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
                avatar: 'https://i.pravatar.cc/150?img=25',
                requestedOn: '2025-05-20',
                purpose:
                    'I want to help students by sharing my AI and ML expertise.',
                techStack: ['Python', 'TensorFlow', 'Flask'],
                status: 'pending',
                reviewedBy: null,
            },
            {
                id: 2,
                name: 'Dev Arora',
                email: 'dev.arora@example.com',
                profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
                avatar: 'https://i.pravatar.cc/150?img=26',
                requestedOn: '2025-05-21',
                purpose:
                    'Looking to contribute backend features and improve documentation.',
                techStack: ['Node.js', 'Express', 'MongoDB'],
                status: 'pending',
                reviewedBy: null,
            },
            {
                id: 3,
                name: 'Aarushi Jain',
                email: 'aarushi.j@example.com',
                profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
                avatar: 'https://i.pravatar.cc/150?img=27',
                requestedOn: '2025-05-18',
                purpose:
                    'I’ve built several student-focused apps and want to scale my impact.',
                techStack: ['React', 'Firebase', 'Figma'],
                status: 'approved',
                reviewedBy: 'admin1',
            },
        ],
        contributors: [
            {
                name: 'Emily Rodriguez',
                email: 'emily.r@example.com',
                avatar: 'https://i.pravatar.cc/150?img=11',
                profilelink: '/channel/1d83f882-2f1e-4f6b-bcca-d81bfb60b340',
                contributorSince: '2025-03-15',
            },
            {
                name: 'David Kim',
                email: 'david.k@example.com',
                avatar: 'https://i.pravatar.cc/150?img=15',
                profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
                contributorSince: '2025-04-02',
            },
        ],
        tasks: [
            {
                taskId: '1',
                title: 'Implement device control API',
                description: 'Create REST API endpoints for device control',
                status: 'completed',
                priority: 'high',
                assignee: {
                    name: 'Michael Chen',
                    email: 'michael.c@example.com',
                    profilelink:
                        '/channel/8cc150e4-e57e-4434-a674-a2b243feb6d2',
                    avatar: 'https://i.pravatar.cc/150?img=5',
                },
                created: '2025-02-10',
                updates: [
                    {
                        id: '1-1',
                        text: 'Completed basic CRUD endpoints',
                        author: 'Michael Chen',
                        date: '2025-02-20',
                        type: 'progress',
                    },
                ],
            },
            {
                taskId: '2',
                title: 'Design mobile app UI',
                description:
                    'Create wireframes and UI components for the mobile app',
                status: 'in-progress',
                priority: 'medium',
                assignee: {
                    name: 'Emily Rodriguez',
                    email: 'emily.r@example.com',
                    profilelink:
                        '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
                    avatar: 'https://i.pravatar.cc/150?img=11',
                },
                created: '2025-03-01',
                updates: [],
            },
        ],
        createdAt: '2025-02-05',
        status: 'Active',
    },
    {
        projectId: 'p002',
        title: 'Sustainable Farming Assistant',
        description:
            'An AI-powered platform that helps farmers optimize crop yields while minimizing environmental impact through data-driven recommendations.',
        longDescription: `
  <div class="font-sans text-gray-700 leading-relaxed space-y-4">
    <p class="text-lg font-semibold ">Transforming Agriculture with Smart Technology 🌾</p>

    <p>
      This innovative <strong>Agricultural Technology Solution</strong> combines AI, data science, and intuitive design to help farmers make informed, efficient, and sustainable decisions.
    </p>

    <p class="font-medium ">🌟 Core Features:</p>
    <ul class="list-disc list-inside pl-4 space-y-1">
      <li><strong>Satellite Imagery:</strong> Analyze crop health remotely using high-resolution data.</li>
      <li><strong>Weather Forecasting:</strong> Plan irrigation with real-time, localized predictions.</li>
      <li><strong>Soil Health:</strong> Evaluate soil conditions and suggest nutrient treatments.</li>
      <li><strong>Pest Detection:</strong> Use AI and computer vision to identify pest threats early.</li>
      <li><strong>Language Accessibility:</strong> Multi-language UI to support rural adoption.</li>
    </ul>

    <p class="font-medium ">🧠 Tech Stack:</p>
    <ul class="list-disc list-inside pl-4 space-y-1">
      <li><strong>Data Analysis:</strong> Python</li>
      <li><strong>Web Interface:</strong> React</li>
      <li><strong>ML Models:</strong> TensorFlow for detection and prediction</li>
    </ul>

    <p>
      Bridging the gap between high-tech tools and everyday agriculture, this project equips farmers with knowledge-driven solutions for a more productive and resilient future.
    </p>
  </div>
`,

        tags: [
            { name: 'Agriculture', color: '#E8F5E9' },
            { name: 'AI', color: '#F3E5F5' },
            { name: 'Sustainability', color: '#E0F7FA' },
        ],
        githubLink: 'https://github.com/ravikant-diwakar/AgriSens?',
        owner: {
            name: 'Priya Patel',
            email: 'priya.p@example.com',
            profilelink: '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
            avatar: 'https://i.pravatar.cc/150?img=19',
        },
        chat: [],
        requests: [
            {
                id: 1,
                name: 'Aarushi Jain',
                email: 'aarushi.j@example.com',
                profilelink: '/channel/8cc150e4-e57e-4434-a674-a2b243feb6d2',
                avatar: 'https://i.pravatar.cc/150?img=27',
                requestedOn: '2025-05-18',
                purpose:
                    'I’ve built several student-focused apps and want to scale my impact.',
                techStack: ['React', 'Firebase', 'Figma'],
                status: 'approved',
                reviewedBy: 'admin1',
            },
            {
                id: 2,
                name: 'Nikhil Bansal',
                email: 'nikhil.b@example.com',
                profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
                avatar: 'https://i.pravatar.cc/150?img=28',
                requestedOn: '2025-05-16',
                purpose:
                    'Keen to work on the analytics dashboard and optimization tasks.',
                techStack: ['Django', 'PostgreSQL', 'Docker'],
                status: 'rejected',
                reviewedBy: 'admin2',
            },
            {
                id: 3,
                name: 'Muskaan Singh',
                email: 'muskaan.singh@example.com',
                profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
                avatar: 'https://i.pravatar.cc/150?img=29',
                requestedOn: '2025-05-19',
                purpose:
                    'Excited to work on frontend designs and accessibility features.',
                techStack: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
                status: 'pending',
                reviewedBy: null,
            },
        ],
        contributors: [
            {
                name: 'Emily Rodriguez',
                email: 'emily.r@example.com',
                avatar: 'https://i.pravatar.cc/150?img=11',
                profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
                contributorSince: '2025-03-15',
            },
            {
                name: 'Carlos Mendez',
                email: 'carlos.m@example.com',
                avatar: 'https://i.pravatar.cc/150?img=28',
                profilelink: '/channel/8cc150e4-e57e-4434-a674-a2b243feb6d2',
                contributorSince: '2025-01-20',
            },
            {
                name: 'Aisha Johnson',
                email: 'aisha.j@example.com',
                avatar: 'https://i.pravatar.cc/150?img=33',
                profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
                contributorSince: '2025-02-15',
            },
        ],
        tasks: [
            {
                taskId: '1',
                title: 'Develop crop health analysis model',
                description:
                    'Create ML model to analyze satellite images for crop health',
                status: 'in-progress',
                priority: 'high',
                assignee: {
                    name: 'Carlos Mendez',
                    email: 'carlos.m@example.com',
                    profilelink: '/channel/8cc150e4-e57e-4434-a674-a2b243feb6d2',
                    avatar: 'https://i.pravatar.cc/150?img=28',
                },
                created: '2025-01-15',
                updates: [
                    {
                        id: '1-1',
                        text: 'Collected initial dataset of 10,000 labeled images',
                        author: 'Carlos Mendez',
                        date: '2025-01-30',
                        type: 'progress',
                    },
                ],
            },
            {
                taskId: '2',
                title: 'Create farmer onboarding flow',
                description:
                    'Design and implement the new farmer registration process',
                status: 'open',
                priority: 'medium',
                assignee: null,
                created: '2025-02-10',
                updates: [],
            },
        ],
        createdAt: '2025-01-10',
        status: 'Active',
    },
    {
        projectId: 'p003',
        title: 'Interactive Language Learning Platform',
        description:
            'A gamified language learning application that uses AI to personalize lessons and provide real-time pronunciation feedback.',
        longDescription: `
  <div class="font-sans text-gray-800 leading-relaxed space-y-4">
    <p class="text-lg font-semibold">Next-Generation Language Learning Platform</p>

    <p>
      This platform transforms how users acquire new languages by integrating modern technologies into a seamless learning experience. Its features are designed to enhance retention, motivation, and personalization.
    </p>

    <p class="font-medium">Key Features:</p>
    <ul class="list-disc list-inside pl-5 space-y-1">
      <li><strong>Speech Recognition:</strong> Real-time pronunciation analysis and scoring for improved accuracy.</li>
      <li><strong>Adaptive Lessons:</strong> Personalized lesson plans tailored to individual learning styles and progress.</li>
      <li><strong>Interactive Content:</strong> Engaging stories, dialogues, and real-life scenarios to reinforce vocabulary and grammar.</li>
      <li><strong>Progress Tracking:</strong> A comprehensive system to track milestones, achievements, and consistency.</li>
      <li><strong>Community Interaction:</strong> Built-in features for language exchange and peer engagement.</li>
    </ul>

    <p class="font-medium">Technology Stack:</p>
    <ul class="list-disc list-inside pl-5 space-y-1">
      <li><strong>Frontend:</strong> Flutter for responsive, cross-platform applications.</li>
      <li><strong>Backend:</strong> Firebase for scalable, real-time database and authentication services.</li>
    </ul>

    <p>
      With a focus on user-centric design and scalable technology, this platform makes language learning more effective and accessible for learners around the globe.
    </p>
  </div>
`,

        tags: [
            { name: 'Education', color: '#FFF8E1' },
            { name: 'AI', color: '#F3E5F5' },
            { name: 'Mobile App', color: '#FCE4EC' },
        ],
        githubLink: 'https://github.com/SudoKMaar/leaf?',
        owner: {
            name: 'Thomas Müller',
            email: 'thomas.m@example.com',
            profilelink: '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
            avatar: 'https://i.pravatar.cc/150?img=40',
        },
        chat: [],
        requests: [
            {
                id: 1,
                name: 'Ananya Ghosh',
                email: 'ananya.g@example.com',
                profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
                avatar: 'https://i.pravatar.cc/150?img=30',
                requestedOn: '2025-05-17',
                purpose:
                    'Looking to write tech blogs and create guides for beginners.',
                techStack: ['HTML', 'CSS', 'Markdown', 'Canva'],
                status: 'pending',
                reviewedBy: null,
            },
            {
                id: 2,
                name: 'Pranav Iyer',
                email: 'pranav.iyer@example.com',
                profilelink: '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
                avatar: 'https://i.pravatar.cc/150?img=31',
                requestedOn: '2025-05-15',
                purpose: 'Interested in helping with testing and bug reports.',
                techStack: ['Jest', 'Cypress', 'JavaScript'],
                status: 'rejected',
                reviewedBy: 'admin1',
            },
        ],
        contributors: [
            {
                name: 'Sophie Laurent',
                email: 'sophie.l@example.com',
                avatar: 'https://i.pravatar.cc/150?img=45',
                profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
                contributorSince: '2025-03-01',
            },
            {
                name: 'Rajiv Kapoor',
                email: 'rajiv.k@example.com',
                avatar: 'https://i.pravatar.cc/150?img=50',
                profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
                contributorSince: '2025-03-15',
            },
        ],
        tasks: [
            {
                taskId: '1',
                title: 'Implement speech recognition',
                description:
                    'Integrate speech-to-text and pronunciation analysis',
                status: 'in-progress',
                priority: 'high',
                assignee: {
                    name: 'Sophie Laurent',
                    email: 'sophie.l@example.com',
                    profilelink: '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
                    avatar: 'https://i.pravatar.cc/150?img=45',
                },
                created: '2025-02-20',
                updates: [
                    {
                        id: '1-1',
                        text: 'Integrated Google Speech API',
                        author: 'Sophie Laurent',
                        date: '2025-03-05',
                        type: 'progress',
                    },
                    {
                        id: '1-2',
                        text: 'Working on accuracy improvements for non-native speech',
                        author: 'Sophie Laurent',
                        date: '2025-03-10',
                        type: 'progress',
                    },
                ],
            },
            {
                taskId: '2',
                title: 'Design gamification elements',
                description:
                    'Create badges, achievements, and progress tracking',
                status: 'open',
                priority: 'medium',
                assignee: null,
                created: '2025-03-01',
                updates: [],
            },
        ],
        createdAt: '2025-02-15',
        status: 'Active',
    },
    {
        projectId: 'p004',
        title: 'Urban Mobility Platform',
        description:
            'A multi-modal transportation platform that integrates public transit, bike-sharing, and ride-hailing services into a single payment and routing system.',
        longDescription: `
  <div class="font-sans text-gray-800 leading-relaxed space-y-4">
    <p class="text-lg font-semibold">Smart Urban Mobility Platform</p>

    <p>
      This platform redefines urban transportation by integrating real-time data, accessibility, and sustainability into a seamless commuting experience.
    </p>

    <p class="font-medium">Core Features:</p>
    <ul class="list-disc list-inside pl-5 space-y-1">
      <li><strong>Multi-Modal Route Planning:</strong> Suggests optimal routes by combining public transport, ride-sharing, and walking paths.</li>
      <li><strong>Unified Payments:</strong> Enables a single, secure payment system across various mobility services.</li>
      <li><strong>Congestion Data:</strong> Uses crowd-sourced data to provide live congestion and traffic updates.</li>
      <li><strong>Carbon Tracking:</strong> Tracks and displays the environmental impact of selected transportation modes.</li>
      <li><strong>Accessibility Focus:</strong> Offers enhanced support for users with mobility impairments and other disabilities.</li>
    </ul>

    <p class="font-medium">Technology Stack:</p>
    <ul class="list-disc list-inside pl-5 space-y-1">
      <li><strong>Frontend:</strong> React.js for responsive web interfaces.</li>
      <li><strong>Mobile:</strong> Kotlin and Swift for native Android and iOS apps.</li>
      <li><strong>API Integration:</strong> Extensive use of public transportation and mapping APIs for dynamic updates.</li>
    </ul>

    <p>
      By integrating smart data and universal access, this solution aims to make urban mobility more efficient, inclusive, and environmentally responsible.
    </p>
  </div>
`,

        tags: [
            { name: 'Transportation', color: '#E3F2FD' },
            { name: 'Smart Cities', color: '#E8EAF6' },
            { name: 'Mobility', color: '#E0F7FA' },
        ],
        githubLink: 'https://github.com/kc-codes/Urban-Mobility-Solution?',
        owner: {
            name: 'Lena Schmidt',
            email: 'lena.s@example.com',
            profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
            avatar: 'https://i.pravatar.cc/150?img=55',
        },
        chat: [],
        requests: [],
        contributors: [
            {
                name: 'Jamal Washington',
                email: 'jamal.w@example.com',
                avatar: 'https://i.pravatar.cc/150?img=60',
                profilelink: '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
                contributorSince: '2025-04-05',
            },
            {
                name: 'Yuki Tanaka',
                email: 'yuki.t@example.com',
                avatar: 'https://i.pravatar.cc/150?img=65',
                profilelink: '/channel/1d83f882-2f1e-4f6b-bcca-d81bfb60b340',
                contributorSince: '2025-04-10',
            },
        ],
        tasks: [
            {
                taskId: '1',
                title: 'Integrate public transit APIs',
                description: 'Connect with city transit data sources',
                status: 'completed',
                priority: 'high',
                assignee: {
                    name: 'Jamal Washington',
                    email: 'jamal.w@example.com',
                    profilelink:
                        '/channel/7h8i9j0k-1234-56ab-cdef-7890123456gh',
                    avatar: 'https://i.pravatar.cc/150?img=60',
                },
                created: '2025-03-20',
                updates: [
                    {
                        id: '1-1',
                        text: 'Integrated with 3 major city transit systems',
                        author: 'Jamal Washington',
                        date: '2025-04-01',
                        type: 'progress',
                    },
                ],
            },
            {
                taskId: '2',
                title: 'Develop routing algorithm',
                description: 'Create multi-modal route optimization engine',
                status: 'in-progress',
                priority: 'high',
                assignee: {
                    name: 'Yuki Tanaka',
                    email: 'yuki.t@example.com',
                    profilelink:
                        '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
                    avatar: 'https://i.pravatar.cc/150?img=65',
                },
                created: '2025-04-01',
                updates: [
                    {
                        id: '2-1',
                        text: 'Basic routing between two modes implemented',
                        author: 'Yuki Tanaka',
                        date: '2025-04-15',
                        type: 'progress',
                    },
                ],
            },
        ],
        createdAt: '2025-03-15',
        status: 'Active',
    },
    {
        projectId: 'p005',
        title: 'Healthcare Data Analytics Platform',
        description:
            'A secure platform for hospitals to analyze patient data, identify trends, and improve treatment outcomes while maintaining HIPAA compliance.',
        longDescription: `
  <div class="font-sans text-gray-800 leading-relaxed space-y-4">
    <p class="text-lg font-semibold">Advanced Healthcare Analytics Platform</p>

    <p>
      This solution leverages data science to enhance decision-making and operational efficiency in healthcare institutions. It delivers actionable insights while ensuring patient privacy and data integrity.
    </p>

    <p class="font-medium">Key Features:</p>
    <ul class="list-disc list-inside pl-5 space-y-1">
      <li><strong>Anonymized Data Analysis:</strong> Processes sensitive patient data while maintaining full compliance with privacy regulations.</li>
      <li><strong>Predictive Modeling:</strong> Identifies patterns to forecast potential disease outbreaks and patient risk levels.</li>
      <li><strong>Outcome Evaluation:</strong> Compares the effectiveness of different treatments across demographics and conditions.</li>
      <li><strong>Real-Time Dashboards:</strong> Empowers hospital administrators with live updates on key performance metrics.</li>
      <li><strong>Blockchain Security:</strong> Implements a secure audit trail for all data access and usage events.</li>
    </ul>

    <p class="font-medium">Technology Stack:</p>
    <ul class="list-disc list-inside pl-5 space-y-1">
      <li><strong>Data Processing:</strong> Python for statistical analysis and machine learning pipelines.</li>
      <li><strong>Frontend:</strong> React.js for responsive and interactive visualizations.</li>
      <li><strong>Security:</strong> End-to-end encryption protocols and blockchain for data integrity.</li>
    </ul>

    <p>
      This platform bridges the gap between data science and clinical decision-making, making healthcare smarter, more secure, and data-driven.
    </p>
  </div>
`,

        tags: [
            { name: 'Healthcare', color: '#FFEBEE' },
            { name: 'Data Science', color: '#E8EAF6' },
            { name: 'Analytics', color: '#E0F7FA' },
        ],
        githubLink:
            'https://github.com/Vikranth3140/Mental-Health-Support-Chatbot?',
        owner: {
            name: 'Dr. Robert Chen',
            email: 'robert.c@example.com',
            profilelink: '/channel/eafb8c41-91bd-464f-ad68-51a3212fdc9c',
            avatar: 'https://i.pravatar.cc/150?img=70',
        },
        chat: [],
        requests: [
            {
                id: 1,
                name: 'Muskaan Singh',
                email: 'muskaan.singh@example.com',
                profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
                avatar: 'https://i.pravatar.cc/150?img=29',
                requestedOn: '2025-05-19',
                purpose:
                    'Excited to work on frontend designs and accessibility features.',
                techStack: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
                status: 'pending',
                reviewedBy: null,
            },
            {
                id: 2,
                name: 'Yash Thakur',
                email: 'yash.t@example.com',
                profilelink: '/channel/8cc150e4-e57e-4434-a674-a2b243feb6d2',
                avatar: 'https://i.pravatar.cc/150?img=29',
                requestedOn: '2025-05-22',
                purpose:
                    'I want to mentor juniors and contribute learning resources.',
                techStack: ['C++', 'DSA', 'Markdown'],
                status: 'approved',
                reviewedBy: 'admin3',
            },
        ],
        contributors: [
            {
                name: 'Maria Garcia',
                email: 'maria.g@example.com',
                avatar: 'https://i.pravatar.cc/150?img=24',
                profilelink: '/channel/f8ca9824-0339-46ef-87e5-0abcf2052889',
                contributorSince: '2025-05-01',
            },
            {
                name: 'Arjun Patel',
                email: 'arjun.p@example.com',
                avatar: 'https://i.pravatar.cc/150?img=23',
                profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
                contributorSince: '2025-05-10',
            },
        ],
        tasks: [
            {
                taskId: '1',
                title: 'Implement data anonymization',
                description:
                    'Develop process to anonymize patient data for analysis',
                status: 'in-progress',
                priority: 'high',
                assignee: {
                    name: 'Maria Garcia',
                    email: 'maria.g@example.com',
                    profilelink: '/channel/a6560152-509a-4661-b1a8-9251682cc749',
                    avatar: 'https://i.pravatar.cc/150?img=75',
                },
                created: '2025-04-20',
                updates: [
                    {
                        id: '1-1',
                        text: 'Completed initial anonymization algorithm',
                        author: 'Maria Garcia',
                        date: '2025-05-05',
                        type: 'progress',
                    },
                    {
                        id: '1-2',
                        text: 'Needs review by legal team for compliance',
                        author: 'Dr. Robert Chen',
                        date: '2025-05-08',
                        type: 'comment',
                    },
                ],
            },
            {
                taskId: '2',
                title: 'Build admin dashboard',
                description:
                    'Create visualization dashboard for hospital administrators',
                status: 'open',
                priority: 'medium',
                assignee: null,
                created: '2025-05-01',
                updates: [],
            },
        ],
        createdAt: '2025-04-15',
        status: 'Active',
    },
];
