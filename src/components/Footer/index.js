
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
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

        this.refs[name].setNativeProps({
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

    componentDidMount = () => this.highlight();
    componentWillReact = () => this.highlight();

    render() {

        var { setRoute } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    setRoute({
                        name: 'Home'
                    });
                }}>
                    <Icon name="home" ref="Home"></Icon>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setRoute({
                        name: 'PlayList'
                    });
                }}>
                    <Icon name="playlist" ref="PlayList"></Icon>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Icon name="magnifier" ref="Discover"></Icon>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Icon name="heart" ref="Fav"></Icon>
                </TouchableOpacity>
            </View>
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
        borderTopWidth: 1,
        borderTopColor: '#d9d9d9',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        opacity: .7,
    }
});
