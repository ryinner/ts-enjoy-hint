import { TypescriptEnjoyHint } from './index';

const enjoyHint = new TypescriptEnjoyHint();

enjoyHint.apply([
    { target: '#first-target', label: 'Hi my friend. It\'s TsEnjoyHint!' },
    { target: '#second-target', shape: 'circle' },
    { target: '#third-target', onEnter: () => { console.log('enter'); }, onLeave: () => { console.log('leave'); }, label: 'You can watch event in console.' },
    { target: '#five-target', label: 'It\'s scroll to target.' }
]);

enjoyHint.open();

console.log(enjoyHint);
