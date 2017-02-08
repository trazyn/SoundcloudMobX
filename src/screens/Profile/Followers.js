
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import FadeImage from '../../components/FadeImage';
import humanNumber from '../../utils/humanNumber';

export default class Followers extends Component {

    static propTypes = {
        users: PropTypes.array.isRequired,
        count: PropTypes.number.isRequired,
    };

    render() {

        var { users, count } = this.props;

        return (
            <View style={styles.container}>
                {
                    users.slice(0, 5).map((user, index) => {

                        return (
                            <View style={styles.avatar} key={index}>
                                <FadeImage {...{
                                    source: {
                                        uri: user.avatar_url,
                                    },
                                    style: {
                                        width: 25,
                                        height: 25,
                                        shadowColor: "#000",
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        zIndex: index + 1,
                                    }
                                }}>
                                {
                                    users.length > 4 && index === 4 && (
                                        <View style={styles.overlay}>
                                            <Icon name="options" color="white" size={12}></Icon>
                                        </View>
                                    )
                                }
                                </FadeImage>
                            </View>
                        );
                    })
                }
                <Text style={styles.count}>{humanNumber(count)} Followers</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 25,
        alignItems: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
    },

    overlay: {
        height: 25,
        width: 25,
        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatar: {
        width: 25,
        height: 25,
        borderRadius: 25,
        overflow: 'hidden',
    },

    count: {
        marginLeft: 8,
        color: '#fff',
        fontSize: 8,
        fontWeight: '100',
    }
});
