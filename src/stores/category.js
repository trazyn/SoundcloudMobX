
import { observable, action } from 'mobx';
import Card from './card';

class Category extends Card {
    @observable loading4refresh = false;
    @observable loading4loadmore = false;
    @observable hasEnd = false;

    @action async doRefresh() {
        self.hasEnd = false;
        self.loading4refresh = true;
        self.nextHref = '';
        /** Dont call the super 'refresh', make sure 'REFRESH' is display */
        self.playlist.replace((await self.request()));
        self.loading4refresh = false;
    }

    @action async doLoadmore(updatePlaylist) {
        self.loading4loadmore = true;

        var playlist = await self.request();
        var remain = 0;

        if (self.playlist.length + playlist.length > 50) {
            remain = 50 - self.playlist.length;
            playlist = playlist.slice(0, remain);

            self.hasEnd = true;
        }

        self.playlist.push(...playlist);
        self.loading4loadmore = false;
    }

    init(target) {
        self.playlist = target.playlist;
        self.genre = target.genre;
        self.type = target.type;
        self.nextHref = target.nextHref;
        self.hasEnd = false;
        self.playing = target.playing;
    }
};

const self = new Category();
export default self;
