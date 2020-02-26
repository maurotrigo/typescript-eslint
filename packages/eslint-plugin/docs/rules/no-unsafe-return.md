# Disallows returning any from a function (`no-unsafe-return`)

Despite your best intentions, the `any` type can sometimes leak into your codebase.
Member access on `any` typed variables is not checked at all by TypeScript, so it creates a potential safety hole, and source of bugs in your codebase.

## Rule Details

This rule disallows returning `any` or `any[]` from a function.
This rule also warns against returning `any[]` to help prevent the potential safety hole of returning `any[]` when you have an explicit return type that is an array.

Examples of **incorrect** code for this rule:

```ts
function foo1() {
  return 1 as any;
}
function foo2() {
  return Object.create(null);
}
const foo3 = () => {
  return 1 as any;
};
const foo4 = () => Object.create(null);

function foo5() {
  return [] as any[];
}
function foo6() {
  return [] as Array<any>;
}
function foo7() {
  return [] as readonly any[];
}
function foo8() {
  return [] as Readonly<any[]>;
}
const foo9 = () => {
  return [] as any[];
};
const foo10 = () => [] as any[];

const foo11 = (): string[] => [1, 2, 3] as any[];
```

Examples of **correct** code for this rule:

```ts
function foo1() {
  return 1;
}
function foo2() {
  return Object.create(null) as Record<string, unknown>;
}

const foo3 = () => [];
const foo4 = () => ['a'];
```

## Related to

- [`no-explicit-any`](./no-explicit-any.md)
- TSLint: [`no-unsafe-any`](https://palantir.github.io/tslint/rules/no-unsafe-any/)
