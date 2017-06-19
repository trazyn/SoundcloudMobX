
import { observable, action } from 'mobx';
import axios from 'axios';
import { CLIENT_ID } from '../config';

class Comments {

    @observable list = [];
    @observable loading = false;
    @observable loading4loadmore = false;

    nextHref = '';
    hasNext = true;

    @action async getList(songid) {

        self.loading = true;

        var response = await axios(`https://api.soundcloud.com/app/v2/tracks/${songid}/comments?client_id=${CLIENT_ID}&limit=20&offset=0`);

        self.list.clear();
        self.list.replace(response.data.collection);
        self.nextHref = response.data.next_href;
        self.hasNext = !!self.nextHref;
        self.loading = false;
    }

    @action async loadMore() {

        if (!self.hasNext) {
            return;
        }

        self.loading4loadmore = true;

        var response = await axios(self.nextHref);
        var comments = response.data.collection;

        self.list.push(...comments);
        self.nextHref = response.data.next_href;
        self.hasNext = !!self.nextHref;
        self.loading4loadmore = false;
    }
};

const self = new Comments();
export default self;
