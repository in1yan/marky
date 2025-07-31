import { useEffect, useRef, useState } from 'react';
import './App.css';
import EasyMDE from 'easymde';
// import 'codemirror/dist/addon/
import 'easymde/dist/easymde.min.css';
import { marked } from 'marked';
import {toast, ToastContainer} from 'react-toastify';
import DOMPurify from 'dompurify'; 
import { Open , Save} from '../wailsjs/go/main/App.js'; 
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // Import a highlight.js theme

marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlighting error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-',
});
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
              Save(content);
              toast.success('File saved');
            },
            className: "fa fa-save",
            title: "Save"
          },
          '|',
          'preview', 'side-by-side', 'fullscreen'
        ],
        initialValue: fileContent,
        renderingConfig: {
          codeSyntaxHighlighting: true,
          markedOptions: {
            highlight: function (code, lang) {
              if (lang && hljs.getLanguage(lang)) {
                try {
                  return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                  console.error('Highlighting error:', err);
                }
              }
              return hljs.highlightAuto(code).value;
            }
          }
        },
        previewRender: function(plainText) {
          return marked.parse(plainText);
        }
      });

      // Set up MutationObserver to watch for preview changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const previewElement = document.querySelector('.editor-preview, .editor-preview-side');
            if (previewElement) {
              previewElement.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
                hljs.highlightElement(block);
              });
            }
          }
        });
      });

      // Start observing changes to the document body
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Store observer reference for cleanup
      mde.current.observer = observer;

      // Set initial preview
      const initialHTML = marked.parse(mde.current.value());
      setPreviewHTML(DOMPurify.sanitize(initialHTML));
    }

    return () => {
      if (mde.current) {
        // Clean up observer
        if (mde.current.observer) {
          mde.current.observer.disconnect();
        }
        mde.current.toTextArea();
        mde.current = null;
      }
    };
  }, [fileContent]);

  return (
    <div id="App" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <textarea style={{ width: '100%', height: '100%', padding: '1rem', border: 'none', outline: 'none', resize: 'none', fontFamily: 'monospace', fontSize: '15px' }} ref={textareaRef} />
      <ToastContainer autoClose={1000} hideProgressBar={true} theme='dark'/>
    </div>
  );
}

export default App;
