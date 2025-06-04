import { Editor } from '@tinymce/tinymce-react';
import { DEFAULT_RTE_TEXT } from '@/Constants/constants';
import { useState } from 'react';
import { icons } from '@/Assets/icons';

export default function RTE({
    defaultValue = DEFAULT_RTE_TEXT,
    onChange = null,
    height = 450,
    width = 'full',
}) {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative w-full h-full drop-shadow-md border-[0.01rem] border-[#e3e3e3] rounded-xl overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-7 fill-[#2556d1] dark:text-[#b5b4b4]">
                        {icons.loading}
                    </div>
                </div>
            )}

            <div className={`w-full ${loading ? 'opacity-0' : 'opacity-100'}`}>
                <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    initialValue={defaultValue}
                    onEditorChange={onChange}
                    init={{
                        menubar: true,
                        height: height,
                        width: width,
                        plugins: [
                            'image',
                            'advlist',
                            'autolink',
                            'lists',
                            'link',
                            'charmap',
                            'preview',
                            'searchreplace',
                            'visualblocks',
                            'code',
                            'fullscreen',
                            'insertdatetime',
                            'media',
                            'table',
                            'help',
                            'wordcount',
                            'anchor',
                        ],
                        toolbar: `undo redo | blocks fontfamily fontsize image | bold italic underline strikethrough forecolor | alignleft aligncenter alignright alignjustify | spellcheckdialog a11ycheck typography | bullist numlist outdent indent | emoticons charmap | removeformat | help`,
                        content_style:
                            'body { font-family: Helvetica, Arial, sans-serif; font-size:14px; }',
                        setup: (editor) => {
                            editor.on('init', () => setLoading(false));
                        },
                    }}
                />
            </div>
        </div>
    );
}
