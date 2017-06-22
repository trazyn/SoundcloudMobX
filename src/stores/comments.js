
import { observable, action } from 'mobx';
import _axios from 'axios';
import { CLIENT_ID } from '../config';

const axios = _axios.create({

    timeout: 12000,
    transformRequest: [data => {
        var str = [];

        for (let key in data) {
            let value = data[key];

            if (data.hasOwnProperty(key) && value) {
                str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
        }

        return str.join('&');
    }]
});

class Comments {
    @observable count = 0;
    @observable list = [];
    @observable loading = false;
    @observable loading4loadmore = false;
    @observable loading4send = false;

    songid = '';
    nextHref = '';
    hasNext = true;

    @action setCount(count) {
        self.count = count;
    }

    @action async getList(songid) {
        self.loading = true;

        var response = await axios(`https://api.soundcloud.com/app/v2/tracks/${songid}/comments?client_id=${CLIENT_ID}&limit=20&offset=0`);

        self.songid = songid;
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

    @action async commit(comment) {
        self.loading4send = true;

        var response = await axios.post(`https://api.soundcloud.com/tracks/${self.songid}/comments?client_id=${CLIENT_ID}`, {
            'comment[body]': comment,
            'comment[timestamp]': 0,
        });
        var res = response.data;

        self.loading4send = false;

        if (comment.id) {
            setTimeout(() => {
                ++self.count;
                self.getList(self.songid);
            });
        }

        return res;
    }
};

const self = new Comments();
export default self;
