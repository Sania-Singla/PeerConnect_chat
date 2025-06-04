import { useContext, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { LayoutGrid } from 'lucide-react';
import { ResumeInfoContext } from '../ResumeInfoContext';
import GlobalApi from '../GlobalApi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function ThemeColor() {
    const colors = [
        '#5579CC', // medium blue
        '#333333', // dark gray (instead of black)
        '#E06A4A', // warm coral
        '#6BA46B', // fresh green
        '#658CCF', // steel blue lighter
        '#B66B93', // soft pinkish mauve
        '#7F63B8', // moderate violet
        '#5DB29B', // teal green
        '#D27D49', // warm caramel
        '#8CAC51', // olive green brighter
        '#7A71B8', // medium indigo
        '#D37B8B', // muted rose
        '#4D7BBF', // bright blue
        '#A7BC44', // lively chartreuse
        '#4CA8BF', // turquoise bright
        '#6B62B5', // moderate purple
        '#6AB276', // fresh green
        '#6B62B5', // slate purple
        '#D0616E', // muted red
        '#4B6CBF', // classic blue
    ];

    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor);
    const { resumeId } = useParams();

    const onColorSelect = (color) => {
        setSelectedColor(color);
        setResumeInfo({
            ...resumeInfo,
            themeColor: color,
        });
        const data = { themeColor: color };
        GlobalApi.UpdateResumeDetail(resumeId, data);
        toast.success('Theme color updated');
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2 items-center border-[#4977ec] text-[#4977ec]"
                >
                    <LayoutGrid size={16} /> Theme
                </Button>
            </PopoverTrigger>
            <PopoverContent className="border border-[#ddd] rounded-xl shadow-lg flex items-center flex-col justify-center">
                <h2 className="mb-4 font-bold">Select Theme Color</h2>
                <div className="grid grid-cols-5 gap-4">
                    {colors.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => onColorSelect(item)}
                            className={`size-8 rounded-full cursor-pointer transition-all border-2 ${
                                selectedColor === item
                                    ? 'border-black scale-110'
                                    : 'border-transparent'
                            }`}
                            style={{ background: item }}
                            title={item}
                        ></div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default ThemeColor;
