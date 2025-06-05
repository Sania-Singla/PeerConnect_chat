import { Schema, model } from 'mongoose';

// Sub-Schemas

const addressSchema = new Schema({
    city: { type: String, required: false },
    state: { type: String, required: true },
    country: { type: String, required: true },
});

const personalSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: addressSchema,
    linkedin: { type: String, required: false },
    github: { type: String, required: false },
    summary: { type: String, required: false },
});

const educationSchema = new Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    major: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: false },
});

const experienceSchema = new Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    currentlyWorking: { type: Boolean, default: false },
    address: addressSchema,
    description: { type: String, required: true },
});

const skillSchema = new Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
});

const projectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], required: true },
    github: { type: String, required: false },
});

const achievementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
});

// Main Resume Schema

const resumeSchema = new Schema(
    {
        userId: { type: String, required: true, ref: 'User' },
        personal: personalSchema,
        education: [educationSchema],
        experience: [experienceSchema],
        skills: [skillSchema],
        projects: [projectSchema],
        achievements: [achievementSchema],
        themeColor: { type: String, required: true, default: '#000000' },
    },
    { timestamps: true }
);

export const Resume = model('Resume', resumeSchema);
