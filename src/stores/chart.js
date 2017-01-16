
import { toJS, observable, action } from 'mobx';
import axios from 'axios';
import Card from './card';

class Chart extends Card {

    @observable showRefresh = false;
    @observable showLoadmore = false;
    @observable hasEnd = false;

    @action async doRefresh() {

        self.hasEnd = false;
        self.showRefresh = true;
        var songs = await self.request();

        self.songs.replace(songs);
        self.showRefresh = false;
    }

    @action async doLoadmore(updatePlaylist) {

        self.showLoadmore = true;

        var songs = await self.request();
        var remain = 0;

        if (self.songs.length + songs.length > 50) {

            remain = 50 - self.songs.length;
            songs = songs.slice(0, remain);

            self.hasEnd = true;
        }

        self.songs.push(...songs);
        self.showLoadmore = false;

        if ('function' === typeof appendPlaylist) {
            appendPlaylist(songs);
        }
    }

    setup(target) {
        self.songs = target.songs;
        self.genre = target.genre;
        self.type = target.type;
        self.hasEnd = false;
    }
};

const self = new Chart();
export default self;
