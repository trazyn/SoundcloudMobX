
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Image,
    StyleSheet,
} from 'react-native';

export default class Playing extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        artwork: PropTypes.string.isRequired,
        enter: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    state = {
        rotate: new Animated.Value(0),
        line1: new Animated.Value(0),
        line2: new Animated.Value(0),
        line3: new Animated.Value(0),
        line4: new Animated.Value(0),
    };

    rotating() {
        var rotate = this.state.rotate;

        Animated.timing(rotate, {
            toValue: 360,
            duration: 60000,
        }).start(e => {
            if (e.finished) {
                rotate.setValue(0);
                this.rotating();
            }
        });
    }

    equalizer() {
        var { line1, line2, line3, line4 } = this.state;

        Animated.sequence([
            Animated.timing(line1, {
                toValue: 20,
                duration: 100,
            }),
            Animated.timing(line1, {
                toValue: 10,
                duration: 100,
            }),
            Animated.timing(line2, {
                toValue: 24,
                duration: 100,
            }),
            Animated.timing(line2, {
                toValue: 5,
                duration: 200,
            }),

            Animated.timing(line3, {
                toValue: 0,
                duration: 100,
            }),
            Animated.timing(line3, {
                toValue: 19,
                duration: 200,
            }),

            Animated.timing(line4, {
                toValue: 18,
                duration: 100,
            }),
            Animated.timing(line4, {
                toValue: 5,
                duration: 200,
            }),
        ]).start(e => {
            if (e.finished) {
                this.equalizer();
            }
        });
    }

    componentDidMount() {
        this.rotating();
        this.equalizer();
    }

    render() {
        var { title, user, artwork } = this.props;
        var { line1, line2, line3, line4 } = this.state;
        var rotate = this.state.rotate.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        });

        return (
            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#f1dfdd',
                }}>
                    <TouchableOpacity style={styles.shadow} onPress={this.props.enter}>
                        <Animated.View style={[styles.cover, {
                            transform: [{
                                rotate
                            }]
                        }]}>
                            <Image {...{
                                source: {
                                    uri: artwork
                                },

                                style: {
                                    width: 200,
                                    height: 200,
                                    resizeMode: 'contain'
                                }
                            }} />
                        </Animated.View>
                    </TouchableOpacity>

                    <View style={styles.equalizer}>
                        <Animated.View style={[styles.line, styles.line1, {
                            height: line1
                        }]} />
                        <Animated.View style={[styles.line, styles.line2, {
                            height: line2
                        }]} />
                        <Animated.View style={[styles.line, styles.line3, {
                            height: line3
                        }]} />
                        <Animated.View style={[styles.line, styles.line4, {
                            height: line4
                        }]} />
                    </View>

                    <View style={styles.info}>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{title}</Text>

                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>{user.username}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 432.5,
        backgroundColor: '#f1dfdd',
    },

    shadow: {
        position: 'absolute',
        left: 50,
        top: 60,
        width: 200,
        height: 200,
        borderRadius: 200,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowRadius: 20,
    },

    cover: {
        width: 200,
        height: 200,
        borderRadius: 200,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#fff'
    },

    info: {
        position: 'absolute',
        left: 30,
        bottom: 30,
        width: 240,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'transparent',
    },

    title: {
        fontSize: 16,
        fontWeight: '100',
        textAlign: 'center',
    },

    username: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: '100',
        textAlign: 'center',
        color: '#999',
    },

    equalizer: {
        position: 'absolute',
        left: 0,
        top: 280,
        width: 300,
        height: 30,
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },

    line: {
        height: 24,
        width: 2,
        margin: 2,
        backgroundColor: '#f50'
    },

    line1: {
        height: 10
    },

    line2: {
        height: 23
    },

    line3: {
        height: 18
    },

    line4: {
        height: 21
    },

});
