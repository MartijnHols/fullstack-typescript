// The thoughts behind this config are:
// We want to use recommended rules as a basis. We will disable any rules that
// are inconvenient and unimportant. A consistent codebase (in addition to
// Prettier), a low learning curve and developer speed are important factors
// being considered.

// Work in progress. A couple of inconvenient rules still need to be disabled.
// Will do as I run into them.

// TODO: Move this to its own repository to make this more reusable and greatly
//  reduce the amount of packages in the package.json.

module.exports = {
  root: true,
  extends: [
    // https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
    'react-app',
    // https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js
    'eslint:recommended',
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L115
    'plugin:react/recommended',
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/eslint-recommended.ts
    'plugin:@typescript-eslint/eslint-recommended',
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.json
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // region Syntax

    // To enforce a consistent codebase, we require stateless (functional)
    // components everywhere it's possible. Functional components have several
    // advantages over class components, such as hooks. It's also easier to
    // write clean functional components.
    'react/prefer-stateless-function': 'warn',

    // Swift removed ++ and -- completely for various good reasons:
    // https://github.com/apple/swift-evolution/blob/master/proposals/0004-remove-pre-post-inc-decrement.md#disadvantages-of-these-operators
    // Use one of the following instead:
    // foo(i++) -> foo(i); i += 1
    // foo(++i) -> i += 1; foo(i)
    // i-- -> i -= 1
    // for (let i = 0; i < arr.length; i++) -> for (let i = 0; i < arr.length; i += 1)
    // NOTE: For the last one, prefer arr.forEach(func)/map/reduce instead.
    'no-plusplus': 'warn',

    // endregion

    // region Style

    // Allow implicit return types. This should make it easier to change code
    // as it doesn't require you to change a load of types in addition. In React
    // code it would be doubly annoying, as we'd have to specify the return type
    // of each functional component.
    // This should not have an impact on type safety, as any input relying on a
    // specific type should have that type specified.
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Disable specific member delimiter style for interfaces and type literals.
    // We don't need an eslint rule for this, as Prettier will already enforce
    // this.
    '@typescript-eslint/member-delimiter-style': 'off',

    // endregion

    // region Convenience

    // Allow using any characters in children texts to keep things easy to
    // maintain and concise. We internationalize all messages anyway, so
    // translators can use the correct typography for their language and we
    // can do whatever is quickest.
    'react/no-unescaped-entities': 0,

    // endregion
  },
}
