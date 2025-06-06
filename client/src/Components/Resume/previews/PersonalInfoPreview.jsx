import { useResumeContext } from '@/Context';
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaGithub,
    FaLinkedinIn,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function PersonalInfoPreview() {
    const { resumeInfo } = useResumeContext();
    const { themeColor, personal } = resumeInfo;

    return (
        <div className="text-nowrap">
            <h2
                className="font-bold text-xl text-center"
                style={{ color: themeColor }}
            >
                {personal?.firstName} {personal?.lastName}
            </h2>

            <div
                className="flex justify-evenly overflow-scroll gap-4 items-end mt-6 text-[11px] font-normal"
                style={{ color: themeColor }}
            >
                {personal?.address && (
                    <div
                        className="flex items-center justify-center font-normal"
                        style={{ color: themeColor }}
                    >
                        <FaMapMarkerAlt className="mr-[5px] size-[10px]" />
                        <span>
                            {`${personal?.address.state}, ${personal?.address.country}`}
                        </span>
                    </div>
                )}
                {personal?.phone && (
                    <div className="flex items-center">
                        <FaPhoneAlt className="mr-[5px] size-[10px]" />
                        <span>{personal?.phone}</span>
                    </div>
                )}
                {personal?.email && (
                    <div className="flex items-center">
                        <FaEnvelope className="mr-[5px] size-[10px]" />
                        <span>{personal?.email}</span>
                    </div>
                )}
                {personal?.linkedin && (
                    <Link
                        className="flex items-center"
                        to={`https://www.linkedin.com/in/${personal?.linkedin}`}
                    >
                        <FaLinkedinIn className="mr-[5px] size-[10px]" />
                        <span>{personal?.linkedin}</span>
                    </Link>
                )}
                {personal?.github && (
                    <Link
                        className="flex items-center"
                        to={`https://www.github.com/${personal?.github}`}
                    >
                        <FaGithub className="mr-[5px] size-[10px]" />
                        <span>{personal?.github}</span>
                    </Link>
                )}
            </div>

            <hr className="mt-[5px]" style={{ borderColor: themeColor }} />
        </div>
    );
}
