import { DeleteAccount, Button } from '..';
import { icons } from '../../Assets/icons';
import { usePopupContext } from '../../Context';

export default function DeleteAccountPopup({ close, reference }) {
    const { setShowPopup } = usePopupContext();

    return (
        <div
            ref={reference}
            onClick={close}
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
                    onClick={() => setShowPopup(false)}
                    className="absolute top-2 right-2"
                />

                <DeleteAccount />
            </div>
        </div>
    );
}
