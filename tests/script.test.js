const { replaceLineBreaks, splitText } = require('../script');

describe('replaceLineBreaks', () => {
  test('replaces newline characters with given symbol', () => {
    const input = 'a\nb\nc';
    expect(replaceLineBreaks(input, '-')).toBe('a-\nb-\nc');
  });

  test('returns original text when symbol is empty', () => {
    const input = 'line1\nline2';
    expect(replaceLineBreaks(input, '')).toBe(input);
  });
});

describe('splitText', () => {
  test('splits text into chunks of given size', () => {
    const input = 'abcdefghij';
    expect(splitText(input, 3)).toEqual(['abc', 'def', 'ghi', 'j']);
  });

  test('returns whole text when chunk size is invalid', () => {
    const input = 'text';
    expect(splitText(input, 0)).toEqual([input]);
  });
});
