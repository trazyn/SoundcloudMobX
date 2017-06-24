
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
} from 'react-native';

import Footer from './components/Footer';

export default class Screen extends Component {
    static propTypes = {
        showFooter: PropTypes.bool,
    };

    static defaultProps = {
        showFooter: true,
    };

    render() {
        var { navigation, showFooter } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {
                        React.cloneElement(this.props.children, {

                            /** Avoid mobx warning: replace 'navigation' in store */
                            navigation,
                        })
                    }
                </View>
                {
                    showFooter && (<Footer navigation={navigation} />)
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
