import { Login, Button } from '@/Components';
import { usePopupContext } from '@/Context';
import { motion } from 'framer-motion';
import { icons } from '@/Assets/icons';

export default function LoginPopup() {
    const { popupInfo, setShowPopup } = usePopupContext();

    return (
        <div className="relative bg-white text-black p-6 flex flex-col items-center justify-center gap-4">
            <Button
                btnText={
                    <div className="size-[20px] stroke-black">
                        {icons.cross}
                    </div>
                }
                title="Close"
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2"
            />

            <div>
                <div className="text-xl font-medium">
                    Login to {popupInfo.content}
                </div>
                <motion.hr
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="border-[0.01rem] border-black w-full"
                />
            </div>

            <Login />
        </div>
    );
}
