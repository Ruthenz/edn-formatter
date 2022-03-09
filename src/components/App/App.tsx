import { useRef } from 'react';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { EDN as edn } from '@codemirror/lang-clojure-map';
// import { StreamLanguage } from '@codemirror/stream-parser';
// import { clojure } from '@codemirror/legacy-modes/mode/clojure';

import CodeArea, { CodeAreaRef } from '../CodeArea/CodeArea';

import EDN from '../../utils/EDN';

import './App.css';

const App: React.FC = () => {
  const jsonRef = useRef<CodeAreaRef>(null);
  const ednRef = useRef<CodeAreaRef>(null);

  const parseJsonToEdn = () => {
    const json = jsonRef.current?.text ?? '';
    const edn = EDN.stringify(JSON.parse(json)) ?? '';
    ednRef.current?.setText(edn);
  }

  const parseEdnToJson = () => {
    const edn = ednRef.current?.text ?? '';
    const json = JSON.stringify(EDN.parse(edn)) ?? '';
    jsonRef.current?.setText(json);
  }

  return (
    <div className="app"> 
      <CodeArea 
        ref={jsonRef}
        title={'JSON'}
        linter={jsonParseLinter()}
        format={(text) => JSON.stringify(JSON.parse(text), null, 2)}
        compress={(text) => JSON.stringify(JSON.parse(text))}
        extensions={[json()]}
      />

      <div className="arrows"> 
        <span 
          role="button" 
          className="arrow right" 
          onClick={parseJsonToEdn} />
        <span 
          role="button" 
          className="arrow left" 
          onClick={parseEdnToJson}/>
      </div>

      <CodeArea 
        ref={ednRef}
        title={'EDN'}
        format={(text) => EDN.stringify(EDN.parse(text), { spaces: 2 }) ?? ''}
        compress={EDN.compress}
        extensions={[edn()]}
      />
    </div>
  );
}

// extensions={[StreamLanguage.define(clojure)]}

export default App;
