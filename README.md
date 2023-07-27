# ts-enjoy-hint
Typescript enjoy hints.

That a simple library based on canvas drawing.

## Settings

```typescript
// All settings.
setSettings({
    nextBtn: 'Next',
    nextBtnClass: 'ts-enjoy-hint-button--next',
    previousBtn: 'Previous',
    previousBtnClass: 'ts-enjoy-hint-button--previous',
    closeBtn: 'X',
    closeBtnClass: 'ts-enjoy-hint-button--close',
    scrollBehavior: 'smooth',
    zIndex: 10
});
```

## Create

```typescript
const tsEnjoyHintInstance = new TsEnjoyHint();
```

## Hint list

```typescript
const target = document.querySelector('#target');

tsEnjoyHintInstance.apply({ target });
//or
tsEnjoyHintInstance.apply({ target: '#target' });
//multiply
tsEnjoyHintInstance.apply([{ target: '#target' }, { target: '#second-target' }]);
```

## Hint item setting

| setting   |   description                   |        value        |
| --------- | ------------------------------- | ------------------- |
| target    | target for hint                 | Element \| selector |
| shape     | selection shape                 | circle \| rectangle |
| onEnter   | before enter hint               | (element) => void   |
| onLeave   | before leave hint               | (element) => void   |
| nextEvent | target event for show next hint | string              |


## Style

```typescript
import '@ryinner/ts-enjoy-hint/style.css'
```