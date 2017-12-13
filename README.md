# grow-loader

The `grow-loader` is a webpack loader to let you split "growable" methods into separate files, by simply adding a decorator to the methods in class declarations.

By "growable methods", we mean the methods that need to be dynamically imported. To learn more about dynamic import, read [this document](https://webpack.js.org/guides/code-splitting/#dynamic-imports) from webpack.

Learn more about grow-loader:

- [Installing grow-loader](#installing-grow-loader)
- [Using grow-loader](#using-grow-loader)
- [Background story](#background-story)
- [Contributing](#Contributing)
- [License](#License)

## Installing grow-loader
To install grow-loader, run the following command on your terminal.

```
npm install --save-dev "grow-loader"
```

## Using grow-loader

- [Getting started](#getting-started)
- [Customizing loader options](#customizing-loader-options)

### Getting started
1. In your webpack config, add `grow-loader` _before_ the `babel-loader`.

    > Note. Webpack chains loaders from right to left, so to run a loader before another loader, it should be put latter. See https://webpack.js.org/configuration/module/#rule-use for more information.

    **webpack.config.js**
    ```js
    {
        test: /\.jsx?$/,
        use: [
            'babel-loader',
            'grow-loader'
        ]
    }
    ```

2. Add the `@grow` decorator to your class methods that need to "grow". The functions marked will be split into separate files.

    ```js
    class SampleClass {

        @grow
        methodToGrow() {
            // ...
        }

        @grow
        methodToGrowAndBind = () => {
            // ...
        }

        methodToBeBundled(){

        }
    }
    ```

    If you use any linter tool before grow-loader, you may use the following import statement (which does nothing) to avoid syntax error.

    ```js
    import grow from 'grow-loader/lib/grow';
    ```

3. To install split functions back, call the `grow()` function.

    ```js
    const sample = new SampleClass();
    console.assert(a.methodToGrow === undefined);
    console.assert(a.methodToGrowAndBind === undefined);

    sample.grow().then(() => {
        sample.methodToGrow();
        sample.methodToGrowAndBind();
    });
    ```

### Customizing loader options

To avoid naming conflicts, you can customize the following grow-loader options.

| Option | Default Value | Description |
| -------|---------|-------------|
| methodName | `grow` | The name of the method to be called before a split method. e.g. `grow()` |
| decoratorName | `grow` | The decorator to be detected. e.g. `@grow`. |

The grow-loader options are to be defined in your webpack config or in an `import` statement.

> Note. Learn more about configuring loaders from the [webpack documentation on loaders](https://webpack.js.org/concepts/loaders/).

The following is an example of customizing the grow method as `myGrow()` and the decorator as `@myGrowDec`.

```js
{
    test: /\.jsx?$/,
    use: [
        'babel-loader',
        'grow-loader?methodName=myGrow&decoratorName=myGrowDec'
    ]
}
```

## React Component Example
Using grow-loader to code-split requires only a few modifications to your code. Here is an example:

**Before applying grow-loader**

```js
export default class A extends React.Component {

    methodToGrow(){}

    anotherMethodToGrow(){}

    methodToBeBundled(){}

    render(){
        return <div>...</div>
    }
}
```

**After applying grow-loader**

```js
class GrowablePage extends React.Component {
    componentDidMount() {
        if (this.grow) {
            this.grow().then(() => {
                this.hasGrown = true;
                this.forceUpdate();
            });
        }
    }
}

export default class A extends GrowablePage {
    @grow
    methodToGrow(){ }

    @grow
    anotherMethodToGrow(){ }

    methodToBeBundled{ }

    @grow
    renderMore() {
        return <div>...</div>
    }

    render(){
        return <div>
            { this.hasGrown ? this.renderMore() : null }
        </div>
    }
}
```

## Background story
Higher-Order Components(HOC) is a common solution in implementing code-splitting. But we found HOC solutions unsuitable for our project built with React.js.

- We use different placeholder components for almost every page, but HOC solutions only support a common component for all pages.
- Instant page transition was our ultimate goal, but the following two problems had surfaced in using HOC solutions:
  - We organize pages in a stack—[see our blog posting on this](https://engineering.linecorp.com/ja/blog/detail/200)—the hooks provided could not be easily integrated.
  - A lot of code modifications were required. Preloading pages would help our case, but preloading costs a lot in time and management. And page transition still felt janky for long pages because of DOM manipulation.

That's why we decided to split every page into two parts:

- **Basic part**: Contains placeholder components in the first view, which are to be included in the main bundle.
- **Grown part**: Parts to be dynamically imported, and rendered after the **Basic Part**

But manually splitting files requires a heavy workload and makes methods in both parts messy. This is why we created the `grow-loader` to do it in a flexible way.

## Contributing

Please check [CONTRIBUTING](./CONTRIBUTING.md) before making a contribution.

## License

[Apache License Version 2.0](./LICENSE)
