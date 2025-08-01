import { useEffect, useRef, useState } from 'react';
import { Editor, Button } from '@/Components';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LANGUAGES } from '@/Constants/constants';
import { useSocketContext } from '@/Context';
import { downloadCodeFile } from '@/Utils';
import { editorService } from '@/Services';
import { icons } from '@/Assets/icons';
import { Resizable } from 're-resizable';

export default function EditorLayout() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const [members, setMembers] = useState([]);
    const [output, setOutput] = useState('');
    const [isCompiling, setIsCompiling] = useState(false);
    const [language, setLanguage] = useState('javascript');
    const [isJoining, setIsJoining] = useState(true);
    const [initialCode, setInitialCode] = useState('');
    const codeRef = useRef('');

    useEffect(() => {
        socket.on('syncCode', ({ code, coders }) => {
            setInitialCode(code);
            codeRef.current = code;
            setMembers(coders);
            setIsJoining(false);
        });

        socket.on('userJoinedCode', (user) => {
            setMembers((prev) => [...prev, user]);
            toast.success(`${user.user_name} joined the room`);
        });

        socket.on('userLeftCode', (user) => {
            setMembers((prev) =>
                prev.filter((m) => m.user_id !== user.user_id)
            );
            toast.success(`${user.user_name} left the room`);
        });

        socket.emit('joinCode', roomId);

        return () => socket.emit('leaveCode', roomId);
    }, [roomId]);

    async function copyRoomId() {
        await navigator.clipboard.writeText(roomId);
        toast.success(`Room ID copied`);
    }

    async function runCode() {
        try {
            setIsCompiling(true);
            const res = await editorService.compile(codeRef.current, language);
            setOutput(res.output || JSON.stringify(res));
        } catch (err) {
            setOutput('An error occurred while compiling.');
        } finally {
            setIsCompiling(false);
        }
    }

    return isJoining ? (
        <div className="flex justify-center items-center h-[calc(100vh-55px)] bg-gray-900 text-white text-lg">
            Joining room...
        </div>
    ) : (
        <div className="flex flex-col h-[calc(100vh-55px)] w-full overflow-hidden bg-gray-900">
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="px-2 flex items-center h-[60px] justify-between w-full drop-shadow-sm border-b-[0.01rem] border-b-gray-600">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                socket.emit('leaveCode', roomId);
                                navigate('/');
                            }}
                            title="Leave Room"
                            defaultStyles={true}
                            className="bg-red-600 hover:bg-red-700 size-fit p-2 text-white"
                            btnText={
                                <div className="fill-white size-4 rotate-180">
                                    {icons.leave}
                                </div>
                            }
                        />
                        <Button
                            onClick={copyRoomId}
                            defaultStyles={true}
                            title="Copy Room ID"
                            className="bg-green-600 hover:bg-green-700 size-fit p-2 text-white"
                            btnText={
                                <div className="fill-white size-4">
                                    {icons.clipboard}
                                </div>
                            }
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <select
                            className="bg-gray-700 text-white px-2 py-[6px] rounded text-sm w-[100px]"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {Object.entries(LANGUAGES).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center -space-x-3">
                            {members.map((m) => (
                                <div
                                    key={m.user_id}
                                    title={m.user_name}
                                    className="cursor-pointer hover:scale-110 hover:z-[100] transition-all duration-200 drop-shadow-sm"
                                >
                                    <img
                                        src={m.user_avatar}
                                        alt={m.user_name}
                                        className="rounded-full size-9"
                                    />
                                </div>
                            ))}
                        </div>

                        <Button
                            className="bg-[#4977ec] hover:bg-[#4977ecc1] text-white p-[6px]"
                            onClick={() => downloadCodeFile(codeRef, language)}
                            btnText={
                                <div className="fill-white size-5">
                                    {icons.download}
                                </div>
                            }
                            title="Download File"
                            defaultStyles={true}
                        />
                    </div>
                </header>

                <main className="h-full overflow-auto">
                    <Editor
                        language={language}
                        initialCode={initialCode}
                        onChange={(code) => (codeRef.current = code)}
                    />
                </main>
            </div>

            <Resizable
                enable={{ top: true }}
                minHeight="50px"
                defaultSize={{ height: '50px' }}
                maxHeight="400px"
            >
                <div className="border-t-[0.01rem] h-full p-2 pt-0 border-t-gray-600 text-white">
                    <div className="flex justify-between items-center h-[50px]">
                        <h5 className="font-semibold pl-2">Output</h5>
                        <div className="flex gap-2">
                            <Button
                                className="bg-green-600 hover:bg-green-700 w-[60px] text-[15px] h-[30px] text-white"
                                onClick={runCode}
                                disabled={isCompiling}
                                defaultStyles={true}
                                btnText={isCompiling ? '. . .' : 'Run'}
                            />
                            <Button
                                className="bg-gray-600 hover:bg-gray-700 w-[60px] text-[15px] h-[30px] text-white"
                                onClick={() => setOutput('')}
                                btnText="Clear"
                                defaultStyles={true}
                            />
                        </div>
                    </div>
                    <pre className="bg-gray-800 rounded-md py-2 px-3 whitespace-pre-wrap break-words h-[calc(100%-50px)] overflow-y-auto">
                        {output || 'Output will appear here...'}
                    </pre>
                </div>
            </Resizable>
        </div>
    );
}
