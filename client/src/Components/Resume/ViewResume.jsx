import { ResumePreview, Button } from '@/Components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RWebShare } from 'react-web-share';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import toast from 'react-hot-toast';

export default function ViewResume() {
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        // Set the share URL once when component mounts
        setShareUrl(`${window.location.origin}/resume/${resumeId}/view`);

        (async function () {
            try {
                const res = await resumeService.getResume(resumeId);
                if (res && !res.message) {
                    setResumeInfo(res);
                } else {
                    toast.error('Resume not found!');
                    navigate('/resume');
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, [resumeId, navigate, setResumeInfo]);

    return loading ? (
        <div>loading...</div>
    ) : (
        <div className="themed max-w-3xl mx-auto space-y-10 py-10 print:py-0 print:max-w-full">
            <div id="no-print">
                <div>
                    <h2 className="text-center text-2xl font-semibold">
                        Congrats! Your Ultimate AI generates Resume is ready !
                    </h2>
                    <p className="text-center mt-3 text-gray-500">
                        Now you are ready to download your resume & share it
                        with your friends and family
                    </p>
                    <div className="flex w-full my-8 gap-5">
                        <Button
                            onClick={() => window.print()}
                            defaultStyles={true}
                            className="w-full text-white py-[5px] px-3"
                            style={{
                                backgroundColor: resumeInfo?.themeColor,
                            }}
                            btnText="Download"
                        />
                        <RWebShare
                            data={{
                                text: 'Check out my resume',
                                url: shareUrl, 
                                title: `${resumeInfo?.firstName} ${resumeInfo?.lastName}'s Resume`,
                            }}
                        >
                            <Button
                                defaultStyles={true}
                                style={{
                                    backgroundColor: resumeInfo?.themeColor,
                                }}
                                className="w-full text-white py-[5px] px-3"
                                btnText="Share"
                            />
                        </RWebShare>
                    </div>
                </div>
            </div>
            <div id="print-area">
                <ResumePreview />
            </div>
        </div>
    );
}
