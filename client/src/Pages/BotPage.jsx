import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { botService } from '@/Services'; // Your API service to get bot response
import { Button } from '@/Components'; // Your button component
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BotPage() {
    const [chats, setChats] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!userInput.trim()) return;

            setLoading(true);

            // Add user message
            const userMessage = { type: 'user', text: userInput };
            setChats((prev) => [...prev, userMessage]);
            setUserInput('');

            // Call bot API
            let data = await botService.getResponse(userInput);

            // Append bot response
            setChats((prev) => [...prev, { type: 'bot', text: data }]);
        } catch (err) {
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
    }

    // Auto-scroll to bottom when chats update
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <div className="w-full overflow-hidden rounded-md flex flex-col h-[calc(100vh-87px)] drop-shadow-sm">
            {/* Header */}
            <div className="bg-[#668cf4] p-3 text-center">
                <h2 className="text-xl font-bold text-white">Quick Bot 💬</h2>
                <p className="text-blue-100 text-sm mt-[5px]">
                    Share your query here, and get instant guidance
                </p>
            </div>

            {/* Chat Container */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-scroll p-4 space-y-5 bg-white h-full"
            >
                {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <div className="text-4xl mb-4">🤖</div>
                        <p className="text-lg">How can I help you today?</p>
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
                            className={`flex ${
                                chat.type === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-[80%] p-3 h-fit rounded-lg text-sm overflow-x-scroll whitespace-pre-wrap ${
                                    chat.type === 'user'
                                        ? 'bg-[#4977ec] text-white rounded-br-none'
                                        : 'bg-[#f6f6f6] text-black rounded-bl-none'
                                }`}
                            >
                                <ReactMarkdown
                                    children={chat.text}
                                    components={{
                                        code({
                                            node,
                                            inline,
                                            className,
                                            children,
                                            ...props
                                        }) {
                                            const match = /language-(\w+)/.exec(
                                                className || ''
                                            );
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(
                                                        /\n$/,
                                                        ''
                                                    )}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code
                                                    className={className}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                />
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
                        <div className="bg-[#f6f6f6] text-black p-3 text-sm rounded-lg rounded-bl-none max-w-[80%] flex items-center gap-2">
                            <span className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                            <span>Thinking...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSubmit}
                className="border-t border-gray-200 p-3 bg-white"
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
    );
}
