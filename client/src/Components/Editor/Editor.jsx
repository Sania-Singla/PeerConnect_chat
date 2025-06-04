import { useEffect, useRef } from 'react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';
import { useSocketContext } from '@/Context';
import { BOILER_PLATE_CODES } from '@/Constants/constants';

export default function Editor({ roomId, lang, onCodeChange }) {
    const editorRef = useRef(null);
    const { socket } = useSocketContext();

    // Initialize the editor
    useEffect(() => {
        const editor = CodeMirror.fromTextArea(
            document.getElementById('realtimeEditor'),
            {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            }
        );

        editor.setSize(null, '100%');
        editorRef.current = editor;

        editor.setValue(BOILER_PLATE_CODES[lang] || '');

        editor.on('change', (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);
            if (origin !== 'setValue') {
                socket?.emit('codeChange', {
                    roomId,
                    code,
                });
            }
        });

        return () => {
            editor.toTextArea(); // clean up on unmount
        };
    }, []);

    // Update editor when `lang` changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setValue(BOILER_PLATE_CODES[lang] || '');
        }
    }, [lang]);

    // Listen for incoming code changes
    useEffect(() => {
        if (socket) {
            socket.on('codeChange', ({ code }) => {
                if (code !== null && editorRef.current) {
                    editorRef.current.setValue(code);
                }
            });
        }
    }, [socket]);

    return (
        <div className="h-full">
            <textarea id="realtimeEditor" />
        </div>
    );
}
