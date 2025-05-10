const COOKIE_OPTIONS = {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'None',
};

const WHITELIST = process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];

const CORS_OPTIONS = {
    origin: function (origin, callback) {
        if (!origin || WHITELIST.includes(origin)) {
            callback(null, true);
        } else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export { COOKIE_OPTIONS, CORS_OPTIONS, WHITELIST };
