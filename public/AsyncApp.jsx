import React from 'react';
import ReactDOM from 'react-dom';

import asyncBranch from './branches/asyncBranch';

const asyncActions = asyncBranch.actions;

const STYLES = {
    h3: {
        marginBottom: 5
    }
};

class AsyncApp extends React.Component {
    constructor(props) {
        super(props);
    }

    state = asyncBranch.store;

    componentDidMount() {
        asyncBranch.watch(this.onStoreChange);

        /**
         * This is intentionally staggered, so that the results can be seen to full effect
         */
        asyncActions.getName()
            .then(() => {
                asyncActions.setLoading(this.state.loading, {
                    name: false
                });

                asyncActions.getAllData()
                    .then(() => {
                        asyncActions.setLoading(this.state.loading, {
                            author: false,
                            description: false
                        });

                        asyncActions.getVersion()
                            .then(() => {
                                asyncActions.setLoading(this.state.loading, {
                                    version: false
                                })
                            });
                    });
            });
    }

    componentWillUnmount() {
        asyncBranch.unwatch(this.onStoreChange);
    }

    onStoreChange = (store) => {
        this.setState(store);
    };

    render() {
        return (
            <div>
                <div>
                    <h3 style={STYLES.h3}>
                        Name
                    </h3>

                    {this.state.loading.name ? 'loading...' : this.state.name}
                </div>

                <div>
                    <h3 style={STYLES.h3}>
                        Description
                    </h3>

                    {!this.state.description ? 'does not exist yet...' : this.state.description}
                </div>

                <div>
                    <h3 style={STYLES.h3}>
                        Author
                    </h3>

                    {this.state.loading.author ? 'loading...' : this.state.author}
                </div>

                <div>
                    <h3 style={STYLES.h3}>
                        Version
                    </h3>

                    {this.state.loading.version ? 'loading...' : this.state.version}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<AsyncApp/>, document.querySelector('#app-container'));