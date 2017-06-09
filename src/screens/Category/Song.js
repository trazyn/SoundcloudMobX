
import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';

export default class Song extends Component {

    static propTypes = {
        artwork: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        user: PropTypes.object.isRequired,
        active: PropTypes.bool.isRequired,
        play: PropTypes.func.isRequired,
        rank: PropTypes.number.isRequired,
    };

    render() {

        var { artwork, title, user, active, play, rank } = this.props;

        return (
            <TouchableOpacity style={styles.container} onPress={play}>
                {
                    active ? (
                        <View style={styles.full}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <FadeImage {...{
                                    source: {
                                        uri: artwork
                                    },

                                    resizeMode: 'cover',
                                    style: {
                                        height: 128,
                                        width: 128,
                                        marginRight: 15,
                                    }
                                }}></FadeImage>

                                <View style={{
                                    width: width - 155,
                                }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                                        {title}
                                    </Text>

                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>
                                        {user.username}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.inner}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <FadeImage {...{
                                    source: {
                                        uri: artwork
                                    },

                                    resizeMode: 'cover',
                                    style: {
                                        height: 54,
                                        width: 54,
                                        marginRight: 15,
                                    }
                                }}></FadeImage>

                                <View style={{
                                    width: 150,
                                }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                                        {title}
                                    </Text>

                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>
                                        {user.username}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.rank}>{rank}</Text>
                        </View>
                    )
                }
            </TouchableOpacity>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    inner: {
        width: width - 60,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    full: {
        width,
        marginTop: 20,
        marginBottom: 20,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        color: 'rgba(0,0,0,.7)',
    },

    username: {
        marginTop: 10,
        fontSize: 13,
        color: 'rgba(0,0,0,.5)',
    },

    rank: {
        fontSize: 18,
    }
});
