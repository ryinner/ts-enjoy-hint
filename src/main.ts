import { TypescriptEnjoyHint } from './index';

const enjoyHint = new TypescriptEnjoyHint();

enjoyHint.apply([{ target: '#first-target' }, { target: '#second-target', shape: 'circle' }]);

enjoyHint.open();

console.log(enjoyHint);
