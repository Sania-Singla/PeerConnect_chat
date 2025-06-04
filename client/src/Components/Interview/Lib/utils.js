import { IMAGES } from '@/Constants/constants';

const mappings = {
    'react.js': 'react',
    reactjs: 'react',
    react: 'react',
    'next.js': 'nextjs',
    nextjs: 'nextjs',
    next: 'nextjs',
    'vue.js': 'vuejs',
    vuejs: 'vuejs',
    vue: 'vuejs',
    'express.js': 'express',
    expressjs: 'express',
    express: 'express',
    'node.js': 'nodejs',
    nodejs: 'nodejs',
    node: 'nodejs',
    mongodb: 'mongodb',
    mongo: 'mongodb',
    mongoose: 'mongoose',
    mysql: 'mysql',
    postgresql: 'postgresql',
    sqlite: 'sqlite',
    firebase: 'firebase',
    docker: 'docker',
    kubernetes: 'kubernetes',
    aws: 'aws',
    azure: 'azure',
    gcp: 'gcp',
    digitalocean: 'digitalocean',
    heroku: 'heroku',
    photoshop: 'photoshop',
    'adobe photoshop': 'photoshop',
    html5: 'html5',
    html: 'html5',
    css3: 'css3',
    css: 'css3',
    sass: 'sass',
    scss: 'sass',
    less: 'less',
    tailwindcss: 'tailwindcss',
    tailwind: 'tailwindcss',
    bootstrap: 'bootstrap',
    jquery: 'jquery',
    typescript: 'typescript',
    ts: 'typescript',
    javascript: 'javascript',
    js: 'javascript',
    'angular.js': 'angular',
    angularjs: 'angular',
    angular: 'angular',
    'ember.js': 'ember',
    emberjs: 'ember',
    ember: 'ember',
    'backbone.js': 'backbone',
    backbonejs: 'backbone',
    backbone: 'backbone',
    nestjs: 'nestjs',
    graphql: 'graphql',
    'graph ql': 'graphql',
    apollo: 'apollo',
    webpack: 'webpack',
    babel: 'babel',
    'parcel.js': 'parcel',
    parceljs: 'parcel',
    npm: 'npm',
    yarn: 'yarn',
    git: 'git',
    github: 'github',
    gitlab: 'gitlab',
    figma: 'figma',
    prisma: 'prisma',
    redux: 'redux',
    flux: 'flux',
    redis: 'redis',
    jest: 'jest',
    mocha: 'mocha',
    chai: 'chai',
    strapi: 'strapi',
    wordpress: 'wordpress',
    contentful: 'contentful',
    netlify: 'netlify',
    vercel: 'vercel',
};

function getRandomInterviewCover() {
    return IMAGES.companies[
        Math.floor(Math.random() * IMAGES.companies.length)
    ];
}

async function checkIconExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // true if icon exists
    } catch {
        return false;
    }
}

async function getTechLogos(textStack) {
    const logoURLs = textStack.map((tech) => {
        const name = tech
            .toLowerCase()
            .replace(/\.js$/, '')
            .replace(/\s+/g, '');
        const normalized = mappings[name] || name;
        const techIconBaseURL =
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
        return {
            tech,
            url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
        };
    });

    const results = await Promise.all(
        logoURLs.map(async ({ tech, url }) => ({
            tech,
            url: (await checkIconExists(url)) ? url : IMAGES.tech,
        }))
    );

    return results;
}

export { getRandomInterviewCover, getTechLogos };
