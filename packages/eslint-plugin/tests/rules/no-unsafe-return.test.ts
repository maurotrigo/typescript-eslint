import rule from '../../src/rules/no-unsafe-return';
import {
  RuleTester,
  batchedSingleLineTests,
  getFixturesRootDir,
} from '../RuleTester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: getFixturesRootDir(),
  },
});

ruleTester.run('no-unsafe-return', rule, {
  valid: [
    'function foo() { return; }',
    'function foo() { return 1; }',
    'function foo() { return ""; }',
    'function foo() { return true; }',
    // this actually types as `never[]`
    'function foo() { return []; }',
  ],
  invalid: [
    ...batchedSingleLineTests({
      code: `
function foo() { return (1 as any); }
function foo() { return Object.create(null); }
const foo = () => { return (1 as any) };
const foo = () => Object.create(null);
      `,
      errors: [
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any',
          },
          line: 2,
          column: 18,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any',
          },
          line: 3,
          column: 18,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any',
          },
          line: 4,
          column: 21,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any',
          },
          line: 5,
          column: 19,
        },
      ],
    }),
    ...batchedSingleLineTests({
      code: `
function foo() { return ([] as any[]); }
function foo() { return ([] as Array<any>); }
function foo() { return ([] as readonly any[]); }
function foo() { return ([] as Readonly<any[]>); }
const foo = () => { return ([] as any[]) };
const foo = () => ([] as any[]);
      `,
      errors: [
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any[]',
          },
          line: 2,
          column: 18,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any[]',
          },
          line: 3,
          column: 18,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any[]',
          },
          line: 4,
          column: 18,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any[]',
          },
          line: 5,
          column: 18,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any[]',
          },
          line: 6,
          column: 21,
        },
        {
          messageId: 'unsafeReturn',
          data: {
            type: 'any[]',
          },
          line: 7,
          column: 20,
        },
      ],
    }),
  ],
});
