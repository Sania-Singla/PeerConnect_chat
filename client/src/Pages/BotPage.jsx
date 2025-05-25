import { useState } from 'react';
import { motion } from 'framer-motion';
import { getResponse } from '@/Services/botService';
import { Button } from '@/Components';

export default function BotPage() {
    const [chats, setChats] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (!userInput.trim()) return;

            const userMessage = { type: 'user', text: userInput };
            setChats((prev) => [...prev, userMessage]);
            setUserInput('');

            const response = await getResponse(userInput);
            const botResponse =
                response || 'Our AI is analyzing your query. Stay tuned!';

            setChats((prev) => [...prev, { type: 'bot', text: botResponse }]);
        } catch (error) {
            setChats((prev) => [
                ...prev,
                {
                    type: 'bot',
                    text: 'Something went wrong. Please try again later.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-38px)] px-4 bg-gray-50">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
                {/* Header */}
                <div className="bg-[#4977ec] p-6 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Quick Bot 💬
                    </h2>
                    <p className="text-blue-100 mt-2">
                        Share your query here, and get instant guidance
                    </p>
                </div>

                {/* Chat Container */}
                <div
                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
                >
                    {chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <div className="text-5xl mb-4">🤖</div>
                            <p className="text-xl">How can I help you today?</p>
                            <p className="text-sm mt-2">
                                Ask me anything about the project
                            </p>
                        </div>
                    ) : (
                        chats.map((chat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 rounded-lg ${
                                        chat.type === 'user'
                                            ? 'bg-[#4977ec] text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                                    }`}
                                >
                                    {chat.text}
                                </div>
                            </motion.div>
                        ))
                    )}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white border border-gray-200 p-4 rounded-lg rounded-bl-none shadow-sm max-w-[80%] flex items-center gap-2">
                                <span className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                                <span>Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <form
                    onSubmit={handleSubmit}
                    className="border-t border-gray-200 p-4 bg-white"
                >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type your message here..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={loading || !userInput.trim()}
                            className="bg-[#4977ec] hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            btnText={loading ? 'Sending...' : 'Send 🚀'}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
