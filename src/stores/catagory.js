
import { observable, action, autorun } from 'mobx';
import Card from './card';

class Catagory extends Card {

    @observable showRefresh = false;
    @observable showLoadmore = false;
    @observable hasEnd = false;

    @action async doRefresh() {

        self.hasEnd = false;
        self.showRefresh = true;
        self.nextHref = '';

        var playlist = await self.request();

        self.playlist.replace(playlist);
        self.showRefresh = false;
    }

    @action async doLoadmore(updatePlaylist) {

        self.showLoadmore = true;

        var playlist = await self.request();
        var remain = 0;

        if (self.playlist.length + playlist.length > 50) {

            remain = 50 - self.playlist.length;
            playlist = playlist.slice(0, remain);

            self.hasEnd = true;
        }

        self.playlist.push(...playlist);
        self.showLoadmore = false;

        if ('function' === typeof appendPlaylist) {
            appendPlaylist(playlist);
        }
    }

    init(target) {
        self.playlist = target.playlist;
        self.genre = target.genre;
        self.type = target.type;
        self.nextHref = target.nextHref;
        self.hasEnd = false;
        self.playing = target.playing;
        self.setPlaying = state => {
            self.playing = state;
            target.setPlaying(state);
        };
    }
};

const self = new Catagory();
export default self;
