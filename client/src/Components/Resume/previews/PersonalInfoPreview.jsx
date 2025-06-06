import { useResumeContext } from '@/Context';
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaLinkedin,
    FaGithub,
} from 'react-icons/fa';

export default function PersonalInfoPreview() {
    const { resumeInfo } = useResumeContext();

    const {
        themeColor,
        firstName,
        linkedin,
        lastName,
        address,
        phone,
        email,
        github,
    } = resumeInfo;

    return (
        <div className="text-nowrap">
            <h2
                className="font-bold text-xl text-center"
                style={{ color: themeColor }}
            >
                {firstName} {lastName}
            </h2>

            <div
                className="flex justify-evenly overflow-scroll gap-4 items-end mt-6 text-[11px] font-normal"
                style={{ color: themeColor }}
            >
                {address && (
                    <div
                        className="flex items-center justify-center font-normal"
                        style={{ color: themeColor }}
                    >
                        <FaMapMarkerAlt className="mr-[5px] size-[10px]" />
                        <span>{address}</span>
                    </div>
                )}
                {phone && (
                    <div className="flex items-center">
                        <FaPhoneAlt className="mr-[5px] size-[10px]" />
                        <span>{phone}</span>
                    </div>
                )}
                {email && (
                    <div className="flex items-center">
                        <FaEnvelope className="mr-[5px] size-[10px]" />
                        <span>{email}</span>
                    </div>
                )}
                {linkedin && (
                    <div className="flex items-center">
                        <FaLinkedin className="mr-[5px] size-[10px]" />
                        <span>{linkedin}</span>
                    </div>
                )}
                {github && (
                    <div className="flex items-center">
                        <FaGithub className="mr-[5px] size-[10px]" />
                        <span>{github}</span>
                    </div>
                )}
            </div>

            <hr className="mt-[5px]" style={{ borderColor: themeColor }} />
        </div>
    );
}
