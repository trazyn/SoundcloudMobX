
import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';

export default class Liked extends Component {

    static propTypes = {
        tracks: PropTypes.array.isRequired,
    };

    covers(tracks) {

        return tracks.map((track, index) => {

            return (
                <FadeImage key={index} {...{
                    source: {
                        uri: track.artwork
                    },
                    style: {
                        height: 83.75,
                        width: 83.75,
                    }
                }}></FadeImage>
            );
        });
    }

    render() {

        var { tracks } = this.props;

        return (
            <View style={styles.container}>
                <View style={{
                    height: 83.75,
                    width: 335,
                    flexDirection: 'row',
                }}>
                {
                    this.covers(tracks.slice(0, 4))
                }
                </View>
                <View style={{
                    height: 83.75,
                    width: 335,
                    flexDirection: 'row',
                }}>
                {
                    this.covers(tracks.slice(4, 8))
                }
                </View>

                <View style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width,
                    height: 167,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={styles.overlay}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: '100',
                        }}>LIKED SONGS</Text>

                        <View style={{
                            marginTop: 40,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <View style={styles.line}></View>
                                <Text style={styles.count}>{
                                    tracks.length > 99 ? '99+' : tracks.length
                                } Songs In Collection</Text>
                            <View style={styles.line}></View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        width,
        height: 167,
        alignItems: 'center',
        justifyContent: 'center',
    },

    overlay: {
        height: 167,
        width: 335,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },

    line: {
        height: .5,
        width: 40,
        backgroundColor: '#fff',
    },

    count: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 14,
        fontWeight: '100',
        color: '#fff',
    },
});
