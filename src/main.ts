import { TsEnjoyHint } from './index';

const enjoyHint = new TsEnjoyHint();

enjoyHint.apply([
    { target: '#five-target', label: 'It\'s scroll to target.' },
    { target: '#first-target', label: 'Hi my friend. It\'s TsEnjoyHint!' },
    { target: '#second-target', shape: 'circle' },
    { target: '#third-target', onEnter: () => { console.log('enter'); }, onLeave: () => { console.log('leave'); }, label: 'You can watch event in console.' },
    { target: '#six-target', label: 'Click!!!!', nextEvent: 'click' }
]);

enjoyHint.open();

console.log(enjoyHint);
