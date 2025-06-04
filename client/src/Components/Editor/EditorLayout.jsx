import { useEffect, useRef, useState } from 'react';
import { Editor, Button } from '@/Components';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BASE_BACKEND_URL, LANGUAGES } from '@/Constants/constants';
import { useSocketContext } from '@/Context';
import { downloadCodeFile } from '@/Utils';
import Avatar from 'react-avatar';

export default function EditorLayout() {
    const [clients, setClients] = useState([]);
    const [output, setOutput] = useState('');
    const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('cpp');
    const [isJoining, setIsJoining] = useState(true);
    const codeRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!location.state?.username) {
            navigate('/');
            return;
        }

        socket.emit('join', {
            roomId,
            username: location.state.username,
        });

        socket.on('joined', ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
                toast.success(`${username} joined the room.`);
            }
            setClients(clients);
            socket.emit('syncCode', {
                code: codeRef.current,
                socketId,
            });
            setIsJoining(false);
        });

        socket.on('disconnected', ({ socketId, username }) => {
            toast.success(`${username} left the room`);
            setClients((prev) => prev.filter((c) => c.socketId !== socketId));
        });

        return () => {
            socket.emit('disconnected', {
                socketId: socket.id,
                username: location.state.username,
            });
        };
    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success(`Room ID copied`);
        } catch (error) {
            toast.error('Failed to copy Room ID');
        }
    };

    const runCode = async () => {
        setIsCompiling(true);
        try {
            let res = await fetch(`${BASE_BACKEND_URL}/codes/compile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: codeRef.current,
                    language: selectedLanguage,
                }),
            });
            res = await res.json();
            setOutput(res.output || JSON.stringify(res));
        } catch (err) {
            setOutput('An error occurred while compiling.');
        } finally {
            setIsCompiling(false);
        }
    };

    if (isJoining) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-lg">
                Joining room...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-87px)] w-full">
            <div className="flex flex-col md:flex-row flex-1">
                {/* Sidebar */}
                <aside className="bg-gray-900 text-white w-full md:w-[240px] border-r border-gray-700 p-4">
                    <span className="font-semibold block mb-3">Members</span>
                    <div className="gap-4 max-h-[200px] md:max-h-full md:h-[calc(100%-160px)] overflow-y-auto flex flex-wrap md:flex-col">
                        {clients.map((client, i) => (
                            <div
                                key={client.socketId}
                                className="relative group cursor-pointer flex items-center gap-3"
                            >
                                {client.avatar ? (
                                    <img
                                        src={client.avatar}
                                        alt={client.username}
                                        className="rounded-full size- border border-gray-700"
                                    />
                                ) : (
                                    <Avatar
                                        name={client.username?.toString()}
                                        size="36"
                                        className="rounded-full text-sm"
                                    />
                                )}

                                <span className="text-sm truncate">
                                    {client.username}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4 border-gray-700" />

                    <div className="flex md:flex-col gap-2">
                        <button
                            onClick={copyRoomId}
                            className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
                        >
                            Copy Room ID
                        </button>
                        <button
                            onClick={() => {
                                socket.emit('disconnected', {
                                    socketId: socket.id,
                                    username: location.state.username,
                                });
                                navigate('/');
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
                        >
                            Leave Room
                        </button>
                    </div>
                </aside>

                {/* Main Editor */}
                <main className="flex flex-col flex-1 overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex flex-wrap gap-2 items-center justify-end bg-gray-900 border-b border-gray-700 p-3">
                        <select
                            className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-[100px]"
                            value={selectedLanguage}
                            onChange={(e) =>
                                setSelectedLanguage(e.target.value)
                            }
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>

                        <Button
                            className="bg-[#4977ec] hover:bg-[#3b62c2] text-white px-4 py-1 rounded"
                            onClick={() =>
                                setIsCompileWindowOpen(!isCompileWindowOpen)
                            }
                            btnText={isCompileWindowOpen ? 'Close' : 'Compile'}
                        />

                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                            onClick={() =>
                                downloadCodeFile(codeRef, selectedLanguage)
                            }
                            btnText="Save File"
                        />
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1 overflow-auto">
                        <Editor
                            roomId={roomId}
                            lang={selectedLanguage}
                            onCodeChange={(code) => (codeRef.current = code)}
                        />
                    </div>
                </main>
            </div>

            {/* Compiler Output */}
            {isCompileWindowOpen && (
                <div className="bg-gray-900 border-t border-gray-600 text-white p-4 h-[200px] overflow-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold">
                            Compiler Output ({selectedLanguage})
                        </h5>
                        <div className="flex space-x-2">
                            <Button
                                className="bg-green-600 hover:bg-green-700 px-4 h-[32px] rounded text-white"
                                onClick={runCode}
                                disabled={isCompiling}
                                btnText={isCompiling ? 'Compiling...' : 'Run'}
                            />
                            <Button
                                className="bg-gray-600 hover:bg-gray-700 px-4 h-[32px] rounded text-white"
                                onClick={() => setIsCompileWindowOpen(false)}
                                btnText="Close"
                            />
                        </div>
                    </div>
                    <pre className="bg-gray-800 p-3 rounded whitespace-pre-wrap break-words h-[calc(100%-40px)] overflow-y-auto">
                        {output || 'Output will appear here after compilation'}
                    </pre>
                </div>
            )}
        </div>
    );
}
