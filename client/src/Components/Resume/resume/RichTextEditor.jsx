import { Button } from '../ui/button';
import { ResumeInfoContext } from '../ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import {
    BtnBold,
    BtnBulletList,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnStrikeThrough,
    BtnUnderline,
    Editor,
    EditorProvider,
    Separator,
    Toolbar,
} from 'react-simple-wysiwyg';
import { AIChatSession } from '../AIModal';
import { toast } from 'sonner';

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
    const [value, setValue] = useState(defaultValue);
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    const GenerateSummeryFromAI = async () => {
        const positionTitle = resumeInfo?.Experience[index]?.title;

        if (!positionTitle) {
            toast('Please add a Position Title');
            return;
        }

        setLoading(true);

        try {
            const PROMPT = `
                            Position Title: ${positionTitle}
                            Write 2–3 bullet points suitable for a resume under this job title. 
                            Return ONLY an HTML <ul><li> list. Do NOT include extra formatting, JSON, or labels.
                            `;

            const response = await AIChatSession.sendMessage(PROMPT);
            const rawText = await response.response.text();

            // Try extracting <ul> content safely
            const match = rawText.match(/<ul[^>]*>[\s\S]*?<\/ul>/i);
            const html = match ? match[0] : rawText;

            if (!/<li>/.test(html)) {
                toast.error(
                    'AI did not return a valid list. Please try again.'
                );
            } else {
                setValue(html.trim());
            }
        } catch (error) {
            console.error('AI summary error:', error);
            toast.error('Failed to generate summary. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between my-2 items-center">
                <label className="text-[14px] font-medium">Work Summery</label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={GenerateSummeryFromAI}
                    disabled={loading}
                    className="hover:bg-blue-50 border-primary text-primary flex gap-2"
                >
                    {loading ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <>
                            <Brain className="h-4 w-4" /> Generate from AI
                        </>
                    )}
                </Button>
            </div>
            <EditorProvider>
                <Editor
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onRichTextEditorChange(e);
                    }}
                >
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}

export default RichTextEditor;
