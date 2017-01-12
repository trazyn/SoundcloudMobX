
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

@inject(stores => ({
    route: stores.route.value,
    setRoute: stores.route.setRoute.bind(stores.route)
}))
@observer
export default class Footer extends Component {

    static propTypes = {
        route: PropTypes.object.isRequired,
        setRoute: PropTypes.func.isRequired,
    };

    highlight() {

        var name = this.props.route.name;
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
    componentWillReact = () => this.highlight();

    render() {

        var { setRoute } = this.props;

        return (
            <Animated.View style={[styles.container, this.props.style]}>
                <TouchableOpacity onPress={e => {
                    setRoute({
                        name: 'Home'
                    });
                }}>
                    <Icon name="playlist" ref="Home" size={16}></Icon>
                </TouchableOpacity>

                <TouchableOpacity onPress={e => {
                    setRoute({
                        name: 'Discover'
                    });
                }}>
                    <Icon name="magnifier" ref="Discover" size={16}></Icon>
                </TouchableOpacity>

                <TouchableOpacity onPress={e => {
                    setRoute({
                        name: 'Fav'
                    });
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
    }
});
