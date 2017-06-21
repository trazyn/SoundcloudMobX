
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
} from 'react-native';

import List from './List';

@inject(stores => ({
    list: stores.profile.recent,
    doRefresh: stores.profile.getRecent,
    loading4refresh: stores.profile.loading,
    doLoadMore: stores.profile.loadMoreRecent,
    loading4loadmore: stores.profile.loading4recent,
}))
@observer
export default class RecentPlaylist extends Component {

    render() {

        return (
            <List {...{
                title: 'RECENTLY PLAYED',
                navigate: this.props.navigation.navigate,
                ...this.props,
            }}></List>
        );
    }
}
