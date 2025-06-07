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

export default function BasicRTE({ value, onChange, name, defaultValue = '' }) {
    return (
        <EditorProvider>
            <Editor
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                name={name}
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
