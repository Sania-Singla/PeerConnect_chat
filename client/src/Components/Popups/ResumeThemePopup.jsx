import { useState } from 'react';
import { Button } from '@/Components';
import { LayoutGrid } from 'lucide-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { RESUME_THEMES } from '@/Constants/constants';
import { useResumeContext } from '@/Context';

export default function ResumeThemePopup() {
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor);
    const { resumeId } = useParams();

    async function onColorSelect(color) {
        try {
            setSelectedColor(color);
            setResumeInfo({ ...resumeInfo, themeColor: color });
            await resumeService.updateTheme(resumeId, color);
            toast.success('Theme Updated');
        } catch (err) {
            toast.error('Failed to update theme color');
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <Button
                className="flex gap-2 items-center border-[#4977ec] text-[#4977ec]"
                btnText={
                    <div>
                        <LayoutGrid size={16} /> Theme
                    </div>
                }
            />
            <div className="border border-[#ddd] rounded-xl shadow-lg flex items-center flex-col justify-center">
                <h2 className="mb-4 font-bold">Select Theme</h2>
                <div className="grid grid-cols-5 gap-4">
                    {RESUME_THEMES.map((color) => (
                        <div
                            key={color}
                            onClick={() => onColorSelect(color)}
                            className={`size-8 rounded-full cursor-pointer transition-all border-2 ${
                                selectedColor === color
                                    ? 'border-black scale-110'
                                    : 'border-transparent'
                            }`}
                            style={{ background: color }}
                            title={color}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
