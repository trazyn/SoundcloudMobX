
import React, { Component, PropTypes } from 'react';
import { Provider, observer } from 'mobx-react/native';
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
import Modal from '../components/Modal';

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

        var { toast, modal } = stores;
        var { navigation, showFooter } = this.props;

        return (
            <Provider {...{
                ...blacklist(stores, 'toast'),
                openModal: modal.open,
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <Modal {...{
                        show: modal.show,
                        items: modal.items.slice(),
                        close: () => modal.toggle(false),
                    }}></Modal>
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
