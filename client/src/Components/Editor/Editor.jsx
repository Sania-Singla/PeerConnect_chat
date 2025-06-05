import { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import { useSocketContext } from '@/Context';
import { BOILER_PLATE_CODES } from '@/Constants/constants';

export default function Editor({ roomId, lang, onCodeChange }) {
    const editorRef = useRef(null);
    const { socket } = useSocketContext();

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
                mode: modeMap[lang] || 'javascript',
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
        editor.setValue(BOILER_PLATE_CODES[lang] || '');
        editorRef.current = editor;

        const handleChange = (instance) => {
            const code = instance.getValue();
            onCodeChange(code);
            socket?.emit('codeChange', { roomId, code });
        };

        editor.on('change', handleChange);

        const handleCodeChange = ({ code }) => {
            if (code !== editor.getValue()) {
                editor.setValue(code);
            }
        };

        socket?.on('codeChange', handleCodeChange);

        return () => {
            editor.off('change', handleChange);
            socket?.off('codeChange', handleCodeChange);
            editor.toTextArea();
        };
    }, [lang, roomId, socket]);

    return (
        <div className="h-full">
            <textarea id="editor" />
        </div>
    );
}
