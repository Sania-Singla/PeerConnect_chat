import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewer, vapi } from '../Lib/vapi';
import { Button } from '@/Components';
import toast from 'react-hot-toast';
import { IMAGES, USER_AVATAR } from '@/Constants/constants';
import { useUserContext } from '@/Context';

const CallStatus = {
    INACTIVE: 'INACTIVE',
    CONNECTING: 'CONNECTING',
    ACTIVE: 'ACTIVE',
    FINISHED: 'FINISHED',
    FAILED: 'FAILED',
};

export default function Agent({ userName, interview }) {
    const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
    const [messages, setMessages] = useState([]);
    const { user } = useUserContext();
    const [lastMessage, setLastMessage] = useState('');
    const [agentSpeaking, setAgentSpeaking] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message) => {
            if (
                message.type === 'transcript' &&
                message.transcriptType === 'final'
            ) {
                const newMessage = {
                    role: message.role,
                    content: message.transcript,
                };
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => {
            console.log('Speech started');
            setAgentSpeaking(true);
        };

        const onSpeechEnd = () => {
            console.log('Speech ended');
            setAgentSpeaking(false);
        };

        const onError = (error) => {
            console.log('Error:', error);
            toast.error(
                'Facing some issue with the assistant. Please try again later.'
            );
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content);
        }
    }, [messages]);

    async function startCall() {
        try {
            setCallStatus(CallStatus.CONNECTING);
            await vapi.start(interviewer, {
                variableValues: {
                    role: interview.role,
                    questions: interview.questions.join('\n'),
                },
            });
        } catch (err) {
            console.error('Error connecting to vapi assistant', err);
            toast.error("Couldn't connect with assistant.  Please try again.");
            setCallStatus(CallStatus.FAILED);
        }
    }

    async function endCall() {
        vapi.stop();
        setCallStatus(CallStatus.FINISHED);

        navigate(`/interview/${interview.id}/feedback`, {
            state: { messages },
        });
    }

    return (
        <div className="bg-[#f6f6f6] text-gray-800 rounded-xl w-full flex flex-col gap-6">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-8">
                {/* AI Interviewer */}
                <div
                    className={`relative w-full h-70 sm:h-90 rounded-xl flex items-center justify-center transition-all ${
                        agentSpeaking
                            ? 'bg-[#4977ec44] border-[#4977ec] border-2'
                            : 'bg-gray-200 border-gray-400 border'
                    }`}
                >
                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <div className="relative flex items-center justify-center shadow-sm bg-[#4977ec6c] rounded-full">
                            {agentSpeaking && (
                                <span className="absolute inline-flex size-30 animate-ping rounded-full bg-[#d2deff] opacity-75" />
                            )}
                            <img
                                src={IMAGES.robot}
                                alt="AI Avatar"
                                className="size-30 rounded-full object-cover border-gray-200 border shadow-sm"
                            />
                        </div>
                        <p className="text-[22px] font-semibold">
                            AI Interviewer
                        </p>
                    </div>
                </div>

                {/* User */}
                <div className="relative w-full h-70 sm:h-90 rounded-xl flex items-center justify-center transition-all bg-gray-200 border-gray-400 border">
                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <div>
                            <img
                                src={user?.user_avatar || USER_AVATAR}
                                alt="User Avatar"
                                className="size-30 rounded-full object-cover border-gray-200 border shadow-sm"
                            />
                        </div>
                        <p className="text-[22px] font-semibold">{userName}</p>
                    </div>
                </div>
            </div>

            {/* Transcript Bubble */}
            {lastMessage && (
                <div
                    className="text-[15px] mt-2 bg-gradient-to-br from-black via-[#1e1e1e] to-[#2c2c2c] rounded-lg border border-gray-800 px-4 py-[10px] text-center text-white shadow-md 
    "
                >
                    {lastMessage}
                </div>
            )}

            {/* Call Controls */}
            <div className="text-center mt-2">
                {callStatus !== CallStatus.ACTIVE ? (
                    <Button
                        onClick={startCall}
                        className="bg-green-500 w-[80px] hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full"
                        disabled={callStatus === CallStatus.CONNECTING}
                        btnText={
                            callStatus === CallStatus.CONNECTING
                                ? '. . .'
                                : 'Call'
                        }
                    />
                ) : (
                    <Button
                        onClick={endCall}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full"
                        btnText="End Call"
                    />
                )}
            </div>
        </div>
    );
}
