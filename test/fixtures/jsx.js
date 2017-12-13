import React from 'react';

export default class TestJsx extends React.Component {
    componentDidMount() {
        return 'methodBundled';
    }

    @grow
    renderMore() {
        return 'renderMore';
    }

    nameOfMethodToBind = 'methodToBind';

    @grow
    methodToBind = () => {
        return this.nameOfMethodToBind;
    }

    methodToBundle() {
        return 'methodToBundle';
    }

    render() {
        return <div>render</div>;
    }
}
