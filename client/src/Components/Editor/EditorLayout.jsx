import { useEffect, useRef, useState } from 'react';
import Client from './Client';
import Editor from './Editor';
import {
    useNavigate,
    Navigate,
    useLocation,
    useParams,
} from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BASE_BACKEND_URL } from '@/Constants/constants';
import { useSocketContext } from '@/Context';
import { Button } from '..';
import { downloadCodeFile } from '@/Utils';

const LANGUAGES = [
    'python3',
    'java',
    'cpp',
    'nodejs',
    'c',
    'ruby',
    'go',
    'scala',
    'bash',
    'sql',
    'pascal',
    'csharp',
    'php',
    'swift',
    'rust',
    'r',
];

export default function EditorPage() {
    const [clients, setClients] = useState([]);
    const [output, setOutput] = useState('');
    const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('cpp');
    const codeRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { socket } = useSocketContext();

    useEffect(() => {
        socket.on('joined', ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
                toast.success(`${username} joined the room.`);
            }
            setClients(clients);
            socket.emit('syncCode', {
                code: codeRef.current,
                socketId,
            });
        });

        socket.on('disconnected', ({ socketId, username }) => {
            toast.success(`${username} left the room`);
            setClients((prev) => prev.filter((c) => c.socketId !== socketId));
        });

        socket.emit('join', {
            roomId,
            username: location.state.username,
        });
    }, []);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success(`Room ID copied`);
        } catch (error) {
            console.error(error);
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
            console.error(err);
            setOutput(res?.error || 'An error occurred');
        } finally {
            setIsCompiling(false);
        }
    };

    return (
        <div className="flex flex-col relative h-full w-full">
            <div className="flex overflow-hidden h-full">
                {/* Sidebar */}
                <div className="h-full">
                    <aside className="h-full w-60 overflow-hidden bg-gray-900 border-[0.09rem] border-gray-700 text-white flex flex-col p-4">
                        <div className="flex flex-col overflow-y-auto flex-grow space-y-2">
                            <span className="text-sm font-semibold mb-2">
                                Members
                            </span>
                            <div className="flex flex-col space-y-4">
                                {clients.map((client, i) => (
                                    <Client
                                        key={client.socketId}
                                        username={client.username}
                                        avatar={`https://i.pravatar.cc/150?img=${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <hr className="my-4 border-gray-700" />

                        <div className="space-y-2">
                            <button
                                onClick={copyRoomId}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
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
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                            >
                                Leave Room
                            </button>
                        </div>
                    </aside>
                </div>

                {/* Editor and language selector */}
                <main className="flex flex-col flex-grow w-full overflow-scroll">
                    <div className="flex justify-end bg-gray-800 items-center border-gray-700 border-b-[0.09rem] p-2 gap-2 h-[50px]">
                        <div className="bg-gray-800 text-white h-full flex justify-end">
                            <select
                                className="bg-gray-700 border border-gray-700 text-white px-2 py-1 rounded-md"
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
                        </div>

                        {/* Toggle Button */}
                        <Button
                            className="text-white rounded-md h-full px-3 flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2]"
                            onClick={() =>
                                setIsCompileWindowOpen(!isCompileWindowOpen)
                            }
                            btnText={
                                isCompileWindowOpen
                                    ? 'Close Compiler'
                                    : 'Open Compiler'
                            }
                        />

                        <Button
                            className="bg-green-600 hover:bg-green-700 px-4 h-[32px] rounded text-white"
                            onClick={() =>
                                downloadCodeFile(codeRef, selectedLanguage)
                            }
                            btnText="Save File"
                        />
                    </div>
                    <div className="flex-grow">
                        <Editor
                            roomId={roomId}
                            onCodeChange={(code) => (codeRef.current = code)}
                        />
                    </div>
                </main>
            </div>

            {/* Compiler Output */}
            {isCompileWindowOpen && (
                <div className="absolute bottom-0 right-0 w-[calc(100%-240px)] z-[1] bg-gray-900 border-t-[0.09rem] border-gray-600 text-white p-4 h-[200px] transition-all">
                    <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold">
                            Compiler Output ({selectedLanguage})
                        </h5>
                        <div className="flex space-x-2">
                            <Button
                                className="bg-green-600 hover:bg-green-700 px-4 h-[32px] rounded text-white"
                                onClick={runCode}
                                disabled={isCompiling}
                                btnText={
                                    isCompiling ? 'Compiling...' : 'Run Code'
                                }
                            />
                            <Button
                                className="bg-gray-600 hover:bg-gray-700 px-4 h-[32px] rounded text-white"
                                onClick={() => setIsCompileWindowOpen(false)}
                                btnText="Close"
                            />
                        </div>
                    </div>
                    <pre className="bg-gray-800 p-3 rounded break-words whitespace-pre-wrap overflow-y-auto overflow-x-hidden h-[calc(100%-40px)]">
                        {output || 'Output will appear here after compilation'}
                    </pre>
                </div>
            )}
        </div>
    );
}
