import { useEffect, useRef } from 'react';
import { useSocketContext } from '@/Context';
import { LANGUAGES } from '@/Constants/constants';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import { useParams } from 'react-router-dom';
import getCursor from './Cursor';

export default function Editor({ language, onChange, initialCode }) {
    const { socket } = useSocketContext();
    const editorRef = useRef(null);
    const { roomId } = useParams();
    const remoteCursors = useRef({});

    useEffect(() => {
        const editor = CodeMirror.fromTextArea(
            document.getElementById('editor'),
            {
                mode: LANGUAGES[language]?.mode,
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
        editor.setValue(initialCode || LANGUAGES[language]?.boilerplate || '');
        editorRef.current = editor;

        const handleChange = (instance) => {
            const code = instance.getValue();
            onChange(code);
            socket.emit('codeChange', { roomId, code });
        };

        const handleCursorActivity = () => {
            const cursor = editor.getCursor();
            socket.emit('cursorChange', { roomId, cursor });
        };

        editor.on('change', handleChange);
        editor.on('cursorActivity', handleCursorActivity);

        socket.on('codeChange', ({ code }) => {
            if (editor.getValue() !== code) {
                const cursor = editor.getCursor(); // save cursor position
                editor.setValue(code);
                editor.setCursor(cursor); // restore cursor
            }
        });

        socket.on('cursorChange', ({ cursor, userId, name }) => {
            // Clear old cursor if exists
            remoteCursors.current[userId]?.clear();

            // new cursor
            const color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
            remoteCursors.current[userId] = editor.setBookmark(cursor, {
                widget: getCursor(color, name),
            });
        });

        return () => {
            editor.toTextArea();
            socket.off('codeChange');
            socket.off('cursorChange');
        };
    }, [language, roomId]);

    return (
        <div className="h-full">
            <textarea id="editor" />
        </div>
    );
}
