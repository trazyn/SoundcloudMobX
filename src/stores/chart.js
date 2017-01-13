
import { toJS, observable, action } from 'mobx';
import Card from './card';

class Chart extends Card {

    @observable showRefresh = false;

    @action async doRefresh() {

        self.showRefresh = true;
        var songs = await self.request({
            genre: {
                key: 'house'
            },

            type: 'trending'
        });

        self.songs.replace(songs);
        self.showRefresh = false;
    }

    setup(target) {
        self.songs = target.songs;
        self.genre = target.genre;
    }
};

const self = new Chart();
export default self;
