
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';

@inject(stores => ({
    session: stores.session,
    getProfile: stores.profile.getProfile,
}))
export default class Fav extends Component {

    componentDidMount() {
        this.props.getProfile(this.props.session.auth.access_token);
    }

    render() {
        return (
            <View style={styles.container}>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
