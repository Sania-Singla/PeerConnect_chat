import { useRef } from 'react';
import { Login, Button } from '..';
import { usePopupContext } from '../../Context';
import { motion } from 'framer-motion';
import { icons } from '../../Assets/icons';

export default function LoginPopup() {
    const { showLoginPopup, loginPopupText, setShowLoginPopup } =
        usePopupContext();
    const ref = useRef();

    function closePopup(e) {
        if (e.target === ref.current) {
            setShowLoginPopup(false);
        }
    }

    return (
        showLoginPopup && (
            <div
                ref={ref}
                onClick={closePopup}
                className="fixed inset-0 backdrop-blur-sm flex items-center justify-center"
            >
                <div className="relative bg-white text-black p-6 flex flex-col items-center justify-center gap-4">
                    <Button
                        btnText={
                            <div className="size-[20px] stroke-black">
                                {icons.cross}
                            </div>
                        }
                        title="Close"
                        onClick={() => setShowLoginPopup(false)}
                        className="absolute top-2 right-2"
                    />

                    <div>
                        <div className="text-xl font-medium">
                            Login to {loginPopupText}
                        </div>
                        <motion.hr
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            className="border-[0.01rem] border-black w-full"
                        />
                    </div>

                    <Login />
                </div>
            </div>
        )
    );
}
