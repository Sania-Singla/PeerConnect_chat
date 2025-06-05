import { useEffect, useRef, useState } from 'react';
import { Editor, Button } from '@/Components';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BASE_BACKEND_URL, LANGUAGES } from '@/Constants/constants';
import { useSocketContext } from '@/Context';
import { downloadCodeFile } from '@/Utils';
import Avatar from 'react-avatar';

export default function EditorLayout() {
    const [coders, setCoders] = useState([]);
    const [output, setOutput] = useState('');
    const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('cpp');
    const [isJoining, setIsJoining] = useState(true);
    const codeRef = useRef(null);
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { socket } = useSocketContext();

    useEffect(() => {
        socket.on('joinedCode', ({ coders, code }) => {
            setCoders(coders);
            codeRef.current = code;
            setIsJoining(false);
        });

        socket.on('userJoinedCode', (user) => {
            setCoders((prev) => [...prev, user]);
            toast.success(`${user.user_name} joined the room`);
        });

        socket.on('userLeftCode', (user) => {
            setCoders((prev) => prev.filter((c) => c.user_id !== user.user_id));
            toast.success(`${user.user_name} left the room`);
        });

        socket.on('giveCode', () => {
            socket.emit('takeCode', codeRef.current);
        });

        socket.emit('joinCode', roomId);

        return () => socket.emit('leaveCode', roomId);
    }, [roomId]);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success(`Room ID copied`);
        } catch (err) {
            console.error('Failed to copy Room ID:', err);
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

    return isJoining ? (
        <div className="flex justify-center items-center h-[calc(100vh-92px)] bg-gray-900 text-white text-lg">
            Joining room...
        </div>
    ) : (
        <div className="flex flex-col h-[calc(100vh-92px)] w-full overflow-hidden">
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="bg-gray-900 text-white max-h-[230px] md:max-h-full w-full md:w-[240px] border-r border-gray-700 p-4 flex flex-col">
                    <span className="font-semibold block mb-3">Members</span>
                    <div className="flex-1 overflow-y-auto gap-4 flex flex-wrap md:flex-nowrap md:flex-col">
                        {coders.map((coder) => (
                            <div
                                key={coder.user_id}
                                className="relative group cursor-pointer flex items-center gap-3"
                            >
                                {coder.user_avatar ? (
                                    <img
                                        src={coder.user_avatar}
                                        alt={coder.user_name}
                                        className="rounded-full size-9 border border-gray-700"
                                    />
                                ) : (
                                    <Avatar
                                        name={coder.user_name?.toString()}
                                        size="36"
                                        className="rounded-full text-sm"
                                    />
                                )}
                                <span className="text-sm truncate">
                                    {coder.user_name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4 border-gray-700" />

                    <div className="flex md:flex-col gap-2">
                        <Button
                            onClick={copyRoomId}
                            className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
                            btnText="Copy Room ID"
                        />
                        <Button
                            onClick={() => {
                                socket.emit('leaveCode', roomId);
                                navigate('/');
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
                            btnText="Leave Room"
                        />
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
                            {LANGUAGES.map((l) => (
                                <option key={l} value={l}>
                                    {l}
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
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-auto">
                            <Editor
                                roomId={roomId}
                                lang={selectedLanguage}
                                onCodeChange={(code) =>
                                    (codeRef.current = code)
                                }
                            />
                        </div>
                    </div>
                </main>
            </div>

            {/* Compiler Output */}
            {isCompileWindowOpen && (
                <div className="bg-gray-900 border-t border-gray-600 text-white h-[200px] overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-2">
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
                    <pre className="bg-gray-800 px-4 py-3 rounded whitespace-pre-wrap break-words h-[calc(100%-56px)] overflow-y-auto">
                        {output || 'Output will appear here...'}
                    </pre>
                </div>
            )}
        </div>
    );
}
