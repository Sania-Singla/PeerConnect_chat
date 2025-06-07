import { Schema, model } from 'mongoose';
import { v4 as uuid } from 'uuid';

// Sub-Schemas

const addressSchema = new Schema({
    state: { type: String, required: true },
    country: { type: String, required: true },
});

const personalSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: addressSchema,
    linkedin: { type: String, required: false, default: '' },
    github: { type: String, required: false, default: '' },
    summary: { type: String, required: false, default: '' },
});

const educationSchema = new Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    major: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: false, default: '' },
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
    link: { type: String, required: false },
});

const achievementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
});

// Main Resume Schema

const resumeSchema = new Schema(
    {
        resumeId: {
            type: String,
            required: true,
            unique: true,
            default: () => uuid(),
        },
        userId: { type: String, required: true, ref: 'User' },
        personal: personalSchema,
        education: [educationSchema],
        experience: [experienceSchema],
        skills: [skillSchema],
        projects: [projectSchema],
        achievements: [achievementSchema],
        title: { type: String, required: true },
        themeColor: { type: String, required: true, default: '#000000' },
    },
    { timestamps: true }
);

export const Resume = model('Resume', resumeSchema);
