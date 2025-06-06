import { useEffect, useRef } from 'react';
import { useSocketContext } from '@/Context';
import { BOILER_PLATE_CODES } from '@/Constants/constants';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import { useParams } from 'react-router-dom';

export default function Editor({ language, onChange }) {
    const { socket } = useSocketContext();
    const editorRef = useRef(null);
    const { roomId } = useParams();

    useEffect(() => {
        const modeMap = {
            javascript: 'javascript',
            python: 'python',
            cpp: 'text/x-c++src',
            java: 'text/x-java',
            c: 'text/x-csrc',
        };

        const editor = CodeMirror.fromTextArea(
            document.getElementById('editor'),
            {
                mode: modeMap[language],
                theme: 'dracula',
                lineNumbers: true,
                autoCloseTags: true,
                autoCloseBrackets: true,
                indentUnit: 4,
                tabSize: 4,
                lineWrapping: true,
            }
        );

        editor.setSize(null, '100%');
        editor.setValue(BOILER_PLATE_CODES[language] || '');
        editorRef.current = editor;

        const handleChange = (instance) => {
            const code = instance.getValue();
            onChange(code);
            socket.emit('codeChange', { roomId, code });
        };

        editor.on('change', handleChange);

        socket.on('codeChange', ({ code }) => editor.setValue(code));

        return () => editor.toTextArea();
    }, [language, roomId]);

    return (
        <div className="h-full">
            <textarea id="editor" />
        </div>
    );
}
