
import { observable, action } from 'mobx';
import axios from 'axios';


class Player {

    @observable playing = false;
    @observable song = {};

    @action toggle() {
        self.playing = !self.playing;
    }

    @action start(song) {
        self.playing = true;
        self.song = song;
    }

    @action stop() {
        self.playing = false;
    }
}

const self = new Player();
export default self;
