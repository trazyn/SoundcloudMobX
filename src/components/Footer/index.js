
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';

export default class Footer extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    highlight(props = this.props) {

        var { navigation } = props;
        var { index, routes } = navigation.state;
        var current = routes[index];
        var name = current.key;
        var ele = this.refs[name];

        if (ele) {

            ele.setNativeProps({
                style: {
                    color: 'red'
                }
            });

            for (var key in this.refs) {

                if (key !== name) {

                    this.refs[key].setNativeProps({

                        style: {
                            color: '#000'
                        }
                    });
                }
            }
        }
    }

    componentDidMount = () => this.highlight();

    componentWillReceiveProps(nextProps) {
        this.highlight(nextProps);
    }

    render() {

        var { navigation } = this.props;

        return (
            <Animated.View style={[styles.container, this.props.style]}>
                <TouchableOpacity style={styles.item} onPress={e => {
                    navigation.navigate('Home');
                }}>
                    <Icon name="playlist" ref="Home" size={16}></Icon>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={e => {
                    navigation.navigate('Discover');
                }}>
                    <Icon name="magnifier" ref="Discover" size={16}></Icon>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={e => {
                    navigation.navigate('Fav');
                }}>
                    <Icon name="heart" ref="Fav" size={16}></Icon>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        bottom: 0,
        width,
        height: 50,
        borderTopWidth: .5,
        borderTopColor: '#000',
        backgroundColor: 'rgba(255,255,255,.6)',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        opacity: .7,
    },

    item: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
