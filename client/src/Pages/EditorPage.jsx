import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '@/Context';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';

export default function EditorPage() {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const { socket } = useSocketContext();

    function generateRoomId(e) {
        e.preventDefault();
        const Id = uuid();
        setRoomId(Id);
        toast.success('Room Id is generated');
    }

    function joinRoom() {
        if (!roomId || !username) {
            toast.error('Both the field is required');
            return;
        }

        socket.emit('join', { roomId, username });

        navigate(`/editor/${roomId}`, {
            state: { username },
        });
        toast.success('Room is created');
    }

    function handleInputEnter(e) {
        if (e.code === 'Enter') joinRoom();
    }

    return (
        <div className="flex items-center justify-center h-full bg-[#f6f6f6] px-4">
            <div className="w-full max-w-md bg-white drop-shadow-sm text-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex flex-col gap-3 items-center justify-center">
                    <div className="fill-[#2b2b2b] size-9">{icons.code}</div>
                    <h4 className="text-xl font-semibold mb-2">Join Room</h4>
                </div>
                <div>
                    <div className="w-full mb-3">
                        <div className="bg-white z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                            <label htmlFor="roomId" className="text-sm">
                                Room ID
                                <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="roomId"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter Room ID"
                                onKeyUp={handleInputEnter}
                                className="shadow-md shadow-[#efefef] px-2 py-3 rounded-md indent-2 w-full border-[0.01rem] border-[#aeaeae] bg-transparent placeholder:text-[#a0a0a0]"
                            />
                        </div>
                    </div>
                    <div className="w-full mb-6">
                        <div className="bg-white z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                            <label htmlFor="username" className="text-sm">
                                Username
                                <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                onKeyUp={handleInputEnter}
                                className="shadow-md shadow-[#efefef] px-2 py-3 rounded-md indent-2 w-full border-[0.01rem] border-[#aeaeae] bg-transparent placeholder:text-[#a0a0a0]"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={joinRoom}
                        className="text-white rounded-md h-[40px] w-full flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2]"
                        btnText="JOIN"
                    />
                </div>
                <p className="w-full text-center text-[15px] mt-4">
                    Don't have a room ID?{' '}
                    <span
                        onClick={generateRoomId}
                        className="text-[#355ab6] hover:underline"
                    >
                        Create New Room
                    </span>
                </p>
            </div>
        </div>
    );
}
