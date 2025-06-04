import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { icons } from '@/Assets/icons';

export default function FAQpage() {
    const [expanded, setExpanded] = useState(null);

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const faqs = [
        {
            question: 'What is PeerConnect?',
            answer: 'PeerConnect is a student-first platform designed to help learners collaborate on real-world projects, practice coding, and build a visible portfolio through community-driven learning.',
        },
        {
            question: 'Who can use PeerConnect?',
            answer: 'Any student or early graduate looking to gain hands-on experience, collaborate with peers, and grow through shared learning can join PeerConnect—no matter their background or college tier.',
        },
        {
            question: 'Is PeerConnect free to use?',
            answer: 'Yes, PeerConnect is completely free. We believe in equal access to collaborative tools and learning opportunities for all students.',
        },
        {
            question: 'Can I contribute to open-source projects here?',
            answer: 'Absolutely! You can find or create collaborative projects, join teams, contribute meaningfully, and get recognized for your work.',
        },
        {
            question: 'What features does PeerConnect offer?',
            answer: 'PeerConnect includes real-time collaborative editing, mock interviews, project boards, chat, resume tools, coding practice, and more—all in one place.',
        },
        {
            question: 'Do I need prior experience to join a project?',
            answer: 'Not at all. Projects vary in complexity and skills required. You can explore beginner-friendly opportunities or start your own based on your comfort level.',
        },
        {
            question: 'How does PeerConnect help with job readiness?',
            answer: 'By working on team projects, practicing interview questions, and building a unified public profile, you gain real-world experience that helps you stand out to recruiters.',
        },
    ];

    return (
        <div className="w-full flex items-start justify-center">
            <div className="w-full p-6">
                <h1 className="text-3xl border-gray-200 border-b-[0.09rem] pb-5 font-bold text-center text-gray-800 mb-6">
                    Frequently Asked Questions
                </h1>

                <div className="space-y-6 max-w-5xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                            onClick={() => toggleExpand(index)}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {faq.question}
                                </h2>
                                <motion.div
                                    animate={{
                                        rotate: expanded === index ? 45 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-center"
                                >
                                    <div className="bg-[#f6f6f6] p-2 rounded-full w-fit shadow-sm hover:brightness-90">
                                        <div className="size-[16px]">
                                            {icons.plus}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <AnimatePresence initial={false}>
                                {expanded === index && (
                                    <motion.div
                                        className="overflow-hidden"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{
                                            opacity: { duration: 0.2 },
                                            height: { duration: 0.3 },
                                        }}
                                    >
                                        <p className="mt-2 text-gray-600">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
