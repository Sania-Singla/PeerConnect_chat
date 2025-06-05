import { Button } from '@/Components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { icons } from '@/Assets/icons';
import { toast } from 'react-hot-toast';
import { AIChatSession } from '../../AIModal';
import { useResumeContext } from '@/Context';
import { resumeService } from '@/Services';

export default function SummaryForm() {
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [summary, setSummary] = useState(resumeInfo?.summary || '');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [aiGeneratedSummaries, setAiGenerateSummaries] = useState();

    // for preview
    useEffect(() => setResumeInfo({ ...resumeInfo, summary }), [summary]);

    const GenerateSummaryFromAI = async () => {
        try {
            setLoading(true);

            const PROMPT = `Job Title: ${resumeInfo.title}, Depends on job title give me list of summary for 3 experience level, Mid Level and Freasher level in 3-4 lines in array format, with summary and experienceLevel Field in JSON Format`;
            const result = await AIChatSession.sendMessage(PROMPT);
            const parsed = JSON.parse(result.response.text());
            console.log('AI Generated Summary:', parsed);

            setAiGenerateSummaries(parsed);
        } catch (error) {
            toast.error('Failed to generate summary from AI');
        } finally {
            setLoading(false);
        }
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setSaving(true);
            await resumeService.saveSection(resumeId, summary);
            toast.success('Details updated');
        } catch (err) {
            navigate('/server-error');
        } finally {
            setSaving(false);
        }
    }

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
                            disabled={loading}
                            type="button"
                            onClick={GenerateSummaryFromAI}
                            className="hover:bg-blue-50 border-primary text-primary flex gap-2"
                            btnText={
                                <>
                                    <Brain className="size-4" /> Generate from
                                    AI
                                </>
                            }
                        />
                    </div>
                    <textarea
                        rows={5}
                        name="summary"
                        id="summary"
                        autoComplete="off"
                        spellCheck="true"
                        className="mt-5 min-h-[150px]"
                        required
                        placeholder="Example: Experienced software developer with 5+ years in web application development..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="border-white rounded-lg px-6 text-base bg-[#4977ec] text-white hover:bg-[#3b62c2]"
                            btnText={
                                saving ? (
                                    <div className="flex items-center justify-center my-2 w-full">
                                        <div className="size-5 fill-[#4977ec] dark:text-[#f7f7f7]">
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
                        {aiGeneratedSummaries?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSummary(item?.summary)}
                                className="hover:bg-blue-50 p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors"
                            >
                                <h3 className="font-semibold text-primary">
                                    {item?.experiencelevel} Level
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
