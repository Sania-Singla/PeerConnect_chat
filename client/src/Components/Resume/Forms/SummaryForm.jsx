import { BasicRTE, Button } from '@/Components';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';
import ReviewButton from '../ReviewButton';
import { ai } from '@/Utils';
import { useResumeContext } from '@/Context';
import { resumeService } from '@/Services';

export default function SummaryForm() {
    const { resumeInfo, setResumeInfo,  } = useResumeContext();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { resumeId } = useParams();
    const [aiGeneratedSummaries, setAiGenerateSummaries] = useState();

    const GenerateSummaryFromAI = async () => {
        try {
            setLoading(true);

            const PROMPT = `Generate three professional summaries for the job title: "${resumeInfo.title}". Each summary should be for a different experience level: Entry Level, Mid Level, and Senior Level. Return an array of JSON objects, each with "level" and "summary" fields. Each summary should be 3-4 lines.`;
            const result = await ai.sendMessage(PROMPT);
            const parsed = JSON.parse(result.response.text());
            console.log('AI Generated Summary:', parsed);

            setAiGenerateSummaries(parsed);
        } catch (error) {
            console.log(error);
            toast.error('Failed to generate summary from AI');
        } finally {
            setLoading(false);
        }
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setSaving(true);
            await resumeService.saveSection('summary', resumeId, {
                summary: resumeInfo.personal.summary,
            });
            toast.success('Details updated');
        } catch (err) {
            toast.error('Failed to save summary');
        } finally {
            setSaving(false);
        }
    }

    function handleChange(value) {
        setResumeInfo((prev) => ({
            ...prev,
            personal: { ...prev.personal, summary: value },
        }));
    }

    const handleApplySuggestions = (suggestions) => {
        setResumeInfo(prev => ({
        ...prev,
        personal: { ...prev.personal, summary: suggestions.improved }
        }));
    };

    return (
        <div>
            <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
                <h2 className="font-bold text-lg">Professional Summary</h2>
                <p className="text-gray-400 text-sm italic mt-1">
                    Write a compelling summary of your professional background
                </p>

                <form className="relative mt-8" onSubmit={onSave}>
                    <div className="absolute -top-4 right-0 flex justify-between items-end">
                        <ReviewButton 
                            sectionName="professional summary"
                            content={resumeInfo?.personal?.summary || ''}
                            onReviewComplete={handleApplySuggestions}
                        />
                        <Button
                            disabled={loading}
                            type="button"
                            onClick={GenerateSummaryFromAI}
                            className="hover:bg-[#4977ec] w-[150px] hover:text-white transition-all duration-100 border border-[#4977ec] text-[#4977ec] h-[30px] text-sm font-medium rounded-md border-primary ml-2 flex justify-center items-center gap-2"
                            btnText={
                                loading ? (
                                    <div className="size-4 fill-[#4977ec] dark:text-[#c5d5ff]">
                                        {icons.loading}
                                    </div>
                                ) : (
                                    <>
                                        <Brain className="size-4" /> Generate
                                        from AI
                                    </>
                                )
                            }
                        />
                    </div>

                    <div className="col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-gray-800">
                            Your Summary
                        </label>
                        <BasicRTE
                            name="summary"
                            value={resumeInfo?.personal?.summary || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder="Example: Experienced software developer with 5+ years in web application development..."
                        />
                    </div>

                    <div className="mt-5 flex justify-end">
                        <Button
                            defaultStyles={true}
                            type="submit"
                            disabled={saving}
                            className="w-[60px] h-[30px] text-[15px] text-white"
                            btnText={
                                saving ? (
                                    <div className="flex items-center justify-center w-full">
                                        <div className="size-4 fill-[#4977ec] dark:text-[#f7f7f7]">
                                            {icons.loading}
                                        </div>
                                    </div>
                                ) : (
                                    'Save'
                                )
                            }
                        />
                    </div>
                </form>
            </div>

            {aiGeneratedSummaries && (
                <div className="my-5 p-5 bg-gray-50 rounded-lg">
                    <h2 className="font-bold text-lg mb-4">AI Suggestions</h2>
                    <div className="space-y-4">
                        {aiGeneratedSummaries?.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => handleChange(item?.summary)}
                                className="hover:bg-blue-50 p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors"
                            >
                                <h3 className="font-semibold text-primary">
                                    {item?.level}
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
