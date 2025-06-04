import { useEffect, useRef, useState } from 'react';
import { Button } from '@/Components';
import {
    BASE_BACKEND_URL,
    BOILER_PLATE_CODES,
    LANGUAGES,
} from '@/Constants/constants';
import { downloadCodeFile } from '@/Utils';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';
import { useQuestionContext } from '@/Context';
import { Resizable } from 're-resizable';

export default function QuestionEditor() {
    const [output, setOutput] = useState('');
    const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('cpp');
    const codeRef = useRef(null);
    const editorRef = useRef(null);
    const question = useQuestionContext();
    const [activeTestCase, setActiveTestCase] = useState(0);
    const [height, setHeight] = useState(250);

    const runCode = async () => {
        setIsCompiling(true);
        try {
            let res = await fetch(`${BASE_BACKEND_URL}/codes/compile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: codeRef.current,
                    language: selectedLanguage,
                }),
            });
            res = await res.json();
            setOutput(res.output || JSON.stringify(res));
        } catch (err) {
            console.error(err);
            setOutput('An error occurred while compiling.');
        } finally {
            setIsCompiling(false);
        }
    };

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
            editorRef.current.on('change', (instance) => {
                const code = instance.getValue(); // code has value which we write
                codeRef.current = code;
            });
        })();
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            const newCode = BOILER_PLATE_CODES[selectedLanguage] || '';
            editorRef.current.setValue(newCode);
            codeRef.current = newCode; // also update the ref for submission
        }
    }, [selectedLanguage]);

    return (
        <div className="flex flex-col relative overflow-hidden h-[calc(100vh-87px)] w-full">
            <div className="flex overflow-hidden h-full">
                {/* Editor and language selector */}
                <main className="flex flex-col flex-grow w-full">
                    <div className="flex flex-row flex-wrap justify-end bg-gray-900 items-center border-gray-700 border-b-[0.09rem] p-3 gap-2">
                        <div className="h-[35px] bg-gray-800 text-white text-sm flex justify-end">
                            <select
                                className="bg-gray-700 border border-gray-700 text-white px-2 w-[100px] py-1 rounded-md"
                                value={selectedLanguage}
                                onChange={(e) =>
                                    setSelectedLanguage(e.target.value)
                                }
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Toggle Button */}
                        <Button
                            className="h-[35px] w-[100px] text-white rounded-md px-3 flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2]"
                            onClick={() =>
                                setIsCompileWindowOpen(!isCompileWindowOpen)
                            }
                            btnText={isCompileWindowOpen ? 'Close' : 'Compile'}
                        />

                        <Button
                            className="bg-green-600 hover:bg-green-700 px-4 h-[35px] w-[100px] rounded text-white"
                            onClick={() =>
                                downloadCodeFile(codeRef, selectedLanguage)
                            }
                            btnText="Save File"
                        />
                    </div>
                    <div className="flex-grow h-full overflow-scroll">
                        <textarea id="realtimeEditor" defaultValue="" />
                    </div>
                </main>
            </div>

            {/* test cases */}
            <Resizable
                size={{ height, width: '100%' }}
                minHeight={200}
                maxHeight={500}
                enable={{ top: true }}
                onResizeStop={(e, direction, ref, d) => {
                    setHeight(height + d.height);
                }}
                className="border-t border-gray-700 bg-gray-900 text-white"
            >
                <div className="w-full h-full overflow-auto">
                    {/* Test case panel content */}
                    <h3 className="text-md font-semibold px-4 py-2 border-b border-gray-700 bg-gray-800 flex items-center">
                        <svg
                            className="w-4 h-4 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        Test Cases
                    </h3>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-700 overflow-x-auto bg-gray-800">
                        {question?.testCases?.length > 0 ? (
                            question.testCases.map((testcase, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeTestCase === index
                                            ? 'border-b-2 border-blue-400 text-blue-400'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                    onClick={() => setActiveTestCase(index)}
                                >
                                    Case {index + 1}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-400">
                                No test cases available
                            </div>
                        )}
                    </div>

                    {/* Active test case content */}
                    {question?.testCases?.length > 0 && (
                        <div className="p-3">
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-300 mb-1">
                                    Input
                                </div>
                                <pre className="bg-gray-800 border border-gray-700 p-2 rounded-md text-sm overflow-x-auto text-white">
                                    {question.testCases[activeTestCase].input}
                                </pre>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-300 mb-1">
                                    Expected Output
                                </div>
                                <pre className="bg-gray-800 border border-gray-700 p-2 rounded-md text-sm overflow-x-auto text-white">
                                    {question.testCases[activeTestCase].output}
                                </pre>
                            </div>

                            {question.testCases[activeTestCase].explanation && (
                                <div className="mt-4">
                                    <div className="text-sm font-medium text-gray-300 mb-1">
                                        Explanation
                                    </div>
                                    <div className="text-sm text-gray-100 bg-gray-800 border border-blue-600 p-3 rounded-md">
                                        {
                                            question.testCases[activeTestCase]
                                                .explanation
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Resizable>

            {/* Compiler Output */}
            {isCompileWindowOpen && (
                <div className="absolute bottom-0 right-0 w-full z-[1] bg-gray-900 border-t-[0.09rem] border-gray-600 text-white p-3 h-[250px] transition-all">
                    <div className="h-[30px] flex justify-between items-center mb-3">
                        <h5 className="font-semibold">
                            Compiler Output ({selectedLanguage})
                        </h5>
                        <div className="flex space-x-2">
                            <Button
                                className="bg-green-600 hover:bg-green-700 px-4 h-[32px] rounded text-white"
                                onClick={runCode}
                                disabled={isCompiling}
                                btnText={isCompiling ? 'Compiling...' : 'Run'}
                            />
                            <Button
                                className="bg-gray-600 hover:bg-gray-700 px-4 h-[32px] rounded text-white"
                                onClick={() => setIsCompileWindowOpen(false)}
                                btnText="Close"
                            />
                        </div>
                    </div>
                    <pre className="bg-gray-800 p-3 rounded-md break-words whitespace-pre-wrap overflow-y-auto overflow-x-hidden h-[184px]">
                        {output || 'Output will appear here after compilation'}
                    </pre>
                </div>
            )}
        </div>
    );
}
