import {
    BtnBold,
    BtnBulletList,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnStrikeThrough,
    BtnUnderline,
    Separator,
    Toolbar,
    Editor,
    EditorProvider,
} from 'react-simple-wysiwyg';

export default function BasicRTE({ value, onChange, name, placeholder = '' }) {
    return (
        <EditorProvider>
            <Editor
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                name={name}
                className="basic-rte text-sm"
            >
                <Toolbar>
                    <BtnBold />
                    <BtnItalic />
                    <BtnUnderline />
                    <BtnStrikeThrough />
                    <Separator />
                    <BtnNumberedList />
                    <BtnBulletList />
                    <Separator />
                    <BtnLink />
                </Toolbar>
            </Editor>
        </EditorProvider>
    );
}
