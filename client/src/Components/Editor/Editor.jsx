import { useEffect, useRef } from 'react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';
import { useSocketContext } from '@/Context';

export default function Editor({ roomId, onCodeChange }) {
    const editorRef = useRef(null);
    const { socket } = useSocketContext();
    useEffect(() => {
        (async function () {
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
            // for sync the code
            editorRef.current = editor;

            editor.setSize(null, '100%');
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue(); // code has value which we write
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socket?.emit('codeChange', {
                        roomId,
                        code,
                    });
                }
            });
        })();
    }, []);

    // data receive from server
    useEffect(() => {
        if (socket) {
            socket.on('codeChange', ({ code }) => {
                if (code !== null) editorRef.current.setValue(code);
            });
        }
    }, [socket]);

    return (
        <div className="h-full">
            <textarea id="realtimeEditor"></textarea>
        </div>
    );
}
