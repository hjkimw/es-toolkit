import { describe, expect, expectTypeOf, it } from 'vitest';
import type { snakeCase as snakeCaseLodash } from 'lodash';
import { snakeCase } from './snakeCase';

describe('snakeCase', () => {
  const strings = ['foo bar', 'Foo bar', 'foo Bar', 'Foo Bar', 'FOO BAR', 'fooBar', '--foo-bar--', '__foo_bar__'];

  it(`should convert \`string\``, () => {
    const actual = strings.map(string => snakeCase(string));

    const expected = strings.map(() => 'foo_bar');

    expect(actual).toEqual(expected);
  });

  it(`should handle double-converting strings`, () => {
    const actual = strings.map(string => snakeCase(snakeCase(string)));

    const expected = strings.map(() => 'foo_bar');

    expect(actual).toEqual(expected);
  });

  it(`should remove contraction apostrophes`, () => {
    const postfixes = ['d', 'll', 'm', 're', 's', 't', 've'];

    ["'", '\u2019'].forEach(apos => {
      const actual = postfixes.map(postfix => snakeCase(`a b${apos}${postfix} c`));

      const expected = postfixes.map(postfix => `a_b${postfix}_c`);

      expect(actual).toEqual(expected);
    });
  });

  it(`should remove Latin mathematical operators`, () => {
    const actual = ['\xd7', '\xf7'].map(snakeCase);
    expect(actual).toEqual(['', '']);
  });

  it(`should coerce \`string\` to a string`, () => {
    const string = 'foo bar';
    expect(snakeCase(Object(string))).toBe('foo_bar');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(snakeCase({ toString: () => string })).toBe('foo_bar');
  });

  it('should match the type of lodash', () => {
    expectTypeOf(snakeCase).toEqualTypeOf<typeof snakeCaseLodash>();
  });
});
