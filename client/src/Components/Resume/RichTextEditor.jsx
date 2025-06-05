import { ResumeInfoContext } from '../ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/Components';
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

export default function RichTextEditor({
    onRichTextEditorChange,
    index,
    defaultValue,
}) {
    const [value, setValue] = useState(defaultValue);
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    const GenerateSummeryFromAI = async () => {
        const position = resumeInfo?.experience[index]?.position;

        if (!position) {
            toast.error('Please add a Position');
            return;
        }

        setLoading(true);

        try {
            const PROMPT = `
                        Position Title: ${position}
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
            } else setValue(html.trim());
        } catch (err) {
            console.log('AI summary error:', err);
            toast.error('Failed to generate summary. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between my-2 items-center">
                <label className="text-[14px] font-medium">Discription</label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={GenerateSummeryFromAI}
                    disabled={loading}
                    className="hover:bg-blue-50 border-primary text-primary flex gap-2"
                    btnText={
                        loading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <>
                                <Brain className="h-4 w-4" /> Generate from AI
                            </>
                        )
                    }
                />
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
