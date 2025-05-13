import { useEffect } from 'react';
import { usePopupContext } from '@/Context';
import { AnimatePresence, motion } from 'framer-motion';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';

export default function CustomToast() {
    const { showToast, setShowToast, toastContent } = usePopupContext();

    const popupVariants = {
        initial: {
            x: '100vw',
        },
        final: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 200,
            },
        },
        exit: {
            x: '100vw',
            transition: {
                type: 'spring',
                stiffness: 200,
            },
        },
    };

    const progressVariants = {
        initial: {
            width: '0%',
        },
        final: {
            width: '100%',
            transition: {
                type: 'tween',
                duration: 4,
            },
        },
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toastContent, showToast]);

    return (
        // since we want to use exit property
        <AnimatePresence>
            {showToast && (
                <motion.div
                    key={toastContent} // whenever this key changes the component animation will restart (re-render)
                    variants={popupVariants}
                    initial="initial"
                    animate="final"
                    exit="exit"
                    className="fixed top-4 right-4 z-[100] text-white overflow-hidden bg-[#2f3744] drop-shadow-md rounded-[5px]"
                >
                    {/* cross btn */}
                    <Button
                        btnText={
                            <div className="size-[16px] stroke-[#aeaeae]">
                                {icons.cross}
                            </div>
                        }
                        onClick={() => setShowToast(false)}
                        className="absolute right-[5px] top-[5px]"
                    />

                    <div className="">
                        {/* text */}
                        <div className="p-4 mr-8 flex items-center justify-start gap-2 w-full">
                            <div className="size-[20px] fill-green-600">
                                {icons.check}
                            </div>
                            <div className="text-lg">{toastContent}</div>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            key={toastContent}
                            className="h-[5px] bg-[#8871ee]"
                            variants={progressVariants}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
