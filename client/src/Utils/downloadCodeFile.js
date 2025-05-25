export default function downloadCodeFile(codeRef, selectedLanguage) {
    const code = codeRef.current || '';
    let fileExtension = 'txt';

    switch (selectedLanguage) {
        case 'python3':
            fileExtension = 'py';
            break;
        case 'cpp':
            fileExtension = 'cpp';
            break;
        case 'java':
            fileExtension = 'java';
            break;
        case 'nodejs':
            fileExtension = 'js';
            break;
        case 'csharp':
            fileExtension = 'cs';
            break;
        case 'c':
            fileExtension = 'c';
            break;
        case 'php':
            fileExtension = 'php';
            break;
        case 'sql':
            fileExtension = 'sql';
            break;
        case 'bash':
            fileExtension = 'sh';
            break;
        case 'go':
            fileExtension = 'go';
            break;
        case 'scala':
            fileExtension = 'scala';
            break;
        case 'pascal':
            fileExtension = 'pas';
            break;
        case 'swift':
            fileExtension = 'swift';
            break;
        case 'ruby':
            fileExtension = 'rb';
            break;
        case 'rust':
            fileExtension = 'rs';
            break;
        case 'r':
            fileExtension = 'r';
            break;
        default:
            fileExtension = 'txt';
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const filename = `code.${fileExtension}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
