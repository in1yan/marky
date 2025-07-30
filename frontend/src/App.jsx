import { useEffect, useRef, useState } from 'react';
import './App.css';
import EasyMDE from 'easymde';
// import 'codemirror/dist/addon/
import 'easymde/dist/easymde.min.css';
import { marked } from 'marked';
import {toast, ToastContainer} from 'react-toastify';
import DOMPurify from 'dompurify'; // Optional: for sanitizing HTML
import { Open , Save} from '../wailsjs/go/main/App.js'; // Import Open function from Wails app

function App() {
  const textareaRef = useRef(null);
  const mde = useRef(null);
  const [previewHTML, setPreviewHTML] = useState('');
  const [fileContent, setFileContent] = useState('');
  useEffect(() => {
    const loadFile = async () => {
      try {
        const content = await Open();
        setFileContent(content);
      } catch (error) {
        console.error('Error loading file:', error);
        setFileContent('# Error\n\nFailed to load file content.');
      } 
    };
    
    loadFile();
  }, []);
  useEffect(() => {
    if (textareaRef.current && !mde.current) {
      mde.current = new EasyMDE({
        element: textareaRef.current,
        placeholder: "Type here...",
        spellChecker: false,
        keyMap: "vim",
        status: false,
        hideIcons: ['guide'],
        toolbar:[
          'bold', 'italic', 'heading', '|',
          'quote', 'unordered-list', 'ordered-list', '|',
          'link', 'image', '|',
          {
            name: "save",
            action: (editor) => {
              const content = editor.value();
              Save(content); // Call Save function from Wails app
              toast.success('File saved');
            },
            className: "fa fa-save",
            title: "Save"
          },
          '|',
          'preview', 'side-by-side', 'fullscreen'
        ],
        initialValue: fileContent,
        renderingConfig:{
          codeSyntaxHighlighting: true
        }
      });

      // Listen to editor changes and update preview
      mde.current.codemirror.on('change', () => {
        const rawMarkdown = mde.current.value();
        const html = marked.parse(rawMarkdown);
        setPreviewHTML(DOMPurify.sanitize(html)); // secure HTML output
      });

      // Set initial preview
      const initialHTML = marked.parse(mde.current.value());
      setPreviewHTML(DOMPurify.sanitize(initialHTML));
    }

    return () => {
      if (mde.current) {
        mde.current.toTextArea();
        mde.current = null;
      }
    };
  }, [fileContent]);

  return (
    <div id="App" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <textarea style={{ width: '100%', height: '100%', padding: '1rem', border: 'none', outline: 'none', resize: 'none', fontFamily: 'monospace', fontSize: '14px' }} ref={textareaRef} />
      <ToastContainer autoClose={1000} hideProgressBar={true} theme='dark'/>
    </div>
  );
}

export default App;
