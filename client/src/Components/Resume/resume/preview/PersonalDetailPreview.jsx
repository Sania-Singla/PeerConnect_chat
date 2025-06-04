import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaLinkedin,
    FaGithub,
} from 'react-icons/fa';

function PersonalDetailPreview({ resumeInfo }) {
    const {
        themeColor,
        firstName,
        linkedin,
        lastName,
        jobTitle,
        address,
        phone,
        email,
        github,
    } = resumeInfo || {};

    return (
        <div className="text-nowrap">
            <h2
                className="font-bold text-xl text-center"
                style={{ color: themeColor }}
            >
                {firstName} {lastName}
            </h2>
            <h2 className="text-center text-xs mt-2 font-medium">{jobTitle}</h2>

            <div
                className="flex justify-evenly gap-6 items-end mt-4 text-[0.7rem] font-normal"
                style={{ color: themeColor }}
            >
                {address && (
                    <div
                        className="flex items-center justify-center mt-1 font-normal"
                        style={{ color: themeColor }}
                    >
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{address}</span>
                    </div>
                )}
                {phone && (
                    <div className="flex items-center">
                        <FaPhoneAlt className="mr-1" />
                        <span>{phone}</span>
                    </div>
                )}
                {email && (
                    <div className="flex items-center">
                        <FaEnvelope className="mr-1" />
                        <span>{email}</span>
                    </div>
                )}
                {linkedin && (
                    <div className="flex items-center">
                        <FaLinkedin className="mr-1" />
                        <span>{linkedin}</span>
                    </div>
                )}
                {github && (
                    <div className="flex items-center">
                        <FaGithub className="mr-1" />
                        <span>{github}</span>
                    </div>
                )}
            </div>

            <hr className="my-1" style={{ borderColor: themeColor }} />
        </div>
    );
}

export default PersonalDetailPreview;
