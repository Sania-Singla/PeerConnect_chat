import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AIChatSession } from '../../AIModal';

const prompt =
    'Job Title: {jobTitle} , Depends on job title give me list of summary for 3 experience level, Mid Level and Freasher level in 3-4 lines in array format, With summary and experience_level Field in JSON Format';

function Summary({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState(resumeInfo?.summary || '');
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [aiGeneratedSummaryList, setAiGenerateSummaryList] = useState();

    useEffect(() => {
        summary &&
            setResumeInfo({
                ...resumeInfo,
                summary, 
            });
    }, [summary]);

    const GenerateSummaryFromAI = async () => {
        setLoading(true);
        try {
            const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
            const result = await AIChatSession.sendMessage(PROMPT);
            const parsed = JSON.parse(result.response.text());

            const summaries = Object.keys(parsed).find((key) =>
                Array.isArray(parsed[key])
            );

            setAiGenerateSummaryList(parsed[summaries] || parsed);
            console.log('AI Generated Summary:', parsed[summaries] || parsed);
        } catch (error) {
            console.error('Failed to generate summary:', error);
            toast.error('Failed to generate summary from AI');
        } finally {
            setLoading(false);
        }
    };

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = { summary }; 
        GlobalApi.UpdateResumeDetail(params?.resumeId, data);
        enabledNext(true);
        setLoading(false);
        toast.success('Details updated');
    };

    return (
        <div>
            <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
                <h2 className="font-bold text-lg">Professional Summary</h2>
                <p className="text-gray-500 text-sm italic mt-1">
                    Write a compelling summary of your professional background
                </p>

                <form className="mt-5" onSubmit={onSave}>
                    <div className="flex justify-between items-end">
                        <label className="font-medium">Your Summary</label>
                        <Button
                            variant="outline"
                            onClick={GenerateSummaryFromAI}
                            type="button"
                            size="sm"
                            className="hover:bg-blue-50 border-primary text-primary flex gap-2"
                        >
                            <Brain className="size-4" /> Generate from AI
                        </Button>
                    </div>
                    <Textarea
                        className="mt-5 min-h-[150px]"
                        required
                        placeholder="Example: Experienced software developer with 5+ years in web application development..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="border-white rounded-lg px-6 text-base bg-[#4977ec] text-white hover:bg-[#3b62c2]"
                        >
                            {loading ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                'Save Summary'
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {aiGeneratedSummaryList && (
                <div className="my-5 p-5 bg-gray-50 rounded-lg">
                    <h2 className="font-bold text-lg mb-4">AI Suggestions</h2>
                    <div className="space-y-4">
                        {aiGeneratedSummaryList?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSummary(item?.summary)}
                                className="hover:bg-blue-50 p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors"
                            >
                                <h3 className="font-semibold text-primary">
                                    {item?.experience_level} Level
                                </h3>
                                <p className="text-sm mt-2 text-gray-700">
                                    {item?.summary}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Summary;
