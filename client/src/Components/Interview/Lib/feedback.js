import { interviews } from '@/DummyData/interviews';

function getInterviewById(id) {
    return interviews.find((i) => i.id === id);
}

function getFeedbackByInterviewId(interviewId) {
    const feedback = JSON.parse(
        localStorage.getItem(`interview-${interviewId}-feedback`)
    );
    return feedback;
}

function saveFeedback(interviewId, feedback) {
    const interview = getInterviewById(interviewId);
    if (!interview) throw new Error('Interview not found');

    localStorage.setItem(
        `interview-${interviewId}-feedback`,
        JSON.stringify(feedback)
    );
}

export { getInterviewById, getFeedbackByInterviewId, saveFeedback };
