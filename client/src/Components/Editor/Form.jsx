import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import toast from 'react-hot-toast';

export default function Form() {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    function joinRoom() {
        if (!roomId) {
            toast.error('Room ID is required');
            return;
        }

        navigate(`/editor/${roomId}`);
        toast.success('Room is created');
    }

    function handleInputEnter(e) {
        if (e.code === 'Enter') joinRoom();
    }

    return (
        <div className="flex items-center justify-center h-[calc(100vh-87px)] bg-[#f6f6f6] px-4">
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

                    <Button
                        onClick={joinRoom}
                        defaultStyles={true}
                        className="h-[40px] w-full mt-5"
                        btnText="JOIN"
                    />
                </div>
                <p className="w-full text-center text-[15px] mt-4">
                    Don't have a room ID?{' '}
                    <span
                        onClick={() => setRoomId(uuid())}
                        className="text-[#355ab6] hover:underline"
                    >
                        Create New Room
                    </span>
                </p>
            </div>
        </div>
    );
}
