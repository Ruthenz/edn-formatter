import { useState, forwardRef, useImperativeHandle, ForwardedRef } from "react";
import { Diagnostic } from "@codemirror/lint";
import CodeMirror, { EditorView, Extension } from '@uiw/react-codemirror';

import './CodeArea.css';

type CodeAreaProps = {
  title: string,
  linter?: (view: EditorView) => Diagnostic[],
  format?: (text: string) => string,
  compress?: (text: string) => string,
  parse?: (text: string) => void,
  extensions: Extension[]
}

export type CodeAreaRef = {
  text: string
  setText: (text: string) => void
};

const CodeArea = forwardRef<CodeAreaRef, CodeAreaProps>(({
  title,
  linter,
  format,
  compress,
  parse,
  extensions
}: CodeAreaProps, ref: ForwardedRef<CodeAreaRef>) => {
  const [text, setText] = useState('');
  const [validations, setValidations] = useState<Diagnostic[]>([]);
  const actionsDisabled = validations.length !== 0;
  const subtitle = linter ? `The ${title} is ${validations.length ? 'not valid!' : 'valid'}` : 'No information currently avaliable about validity';

  useImperativeHandle(ref, () => ({
    text,
    setText
  }));

  return ( 
    <div className="code-area"> 
      <div className="header">{title}</div>
      <div className="sub-header">
        {subtitle} {validations.map((diag) => <span key={diag.message}>{diag.message}</span>)}
      </div>
      <div className="actions"> 
        {format && (<button 
          disabled={actionsDisabled} 
          onClick={() => setText(format(text))}>
          format
        </button>)}
        {compress && (<button 
          disabled={actionsDisabled} 
          onClick={() => setText(compress(text))}>
          compress
        </button>)}
        {parse && (<button 
          disabled={actionsDisabled} 
          onClick={() => parse(text)}
        > 
          parse
        </button>)}
      </div>
      <CodeMirror
        value={text}
        height="100%"
        width="100%"
        theme="dark"
        extensions={extensions}
        onChange={(value, viewUpdate) => {
          setText(value);
          if (linter) {
            setValidations(linter(viewUpdate.view));
          };
        }}
      />
    </div>
   );
});

export default CodeArea;
