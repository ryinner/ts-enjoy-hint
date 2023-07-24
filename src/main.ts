import { TypescriptEnjoyHint } from './index';

const enjoyHint = new TypescriptEnjoyHint();

enjoyHint.apply([{ target: '#first-target', label: 'Hi my friend. It\'s TsEnjoyHint!' }, { target: '#second-target', shape: 'circle' }]);

enjoyHint.open();

console.log(enjoyHint);
