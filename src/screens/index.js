
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react/native';
import { Provider } from 'mobx-react/native';
import axios from 'axios';
import {
    View,
    StyleSheet,
    NativeModules,
} from 'react-native';

import blacklist from '../utils/blacklist';
import stores from '../stores';
import Footer from './components/Footer';
import Toast from '../components/Toast';
import Options from '../components/Options';

@observer
export default class Screen extends Component {

    static propTypes = {
        showFooter: PropTypes.bool,
    };

    static defaultProps = {
        showFooter: true,
    };

    componentWillMount() {

        /** Debug network in chrome devtools network tab */
        GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
    }

    async componentDidMount() {

        await stores.session.init();
        await stores.player.init();
    }

    render() {

        var { toast, options } = stores;
        var { navigation, showFooter } = this.props;

        return (
            <Provider {...{
                ...blacklist(stores, 'toast'),
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <Options {...{
                        show: options.show,
                        toggle: () => options.toggle(),
                        close: () => options.toggle(false),
                    }}></Options>
                    <Toast {...{
                        message: toast.message,
                        show: toast.show,
                        color: toast.color,
                        close: () => toast.toggle(false),
                    }}></Toast>
                    <View style={styles.container}>
                        {
                            React.cloneElement(this.props.children, {

                                /** Avoid mobx warning: replace 'navigation' in store */
                                navigation,
                                message: {
                                    info: toast.showMessage,
                                    error: toast.showError,
                                },
                                openModal: () => options.toggle(true),
                            })
                        }
                    </View>
                    {
                        showFooter && (
                            <Footer {...{
                                navigation,
                            }}></Footer>
                        )
                    }
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
