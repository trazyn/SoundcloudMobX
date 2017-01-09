
import { observable, action } from 'mobx';
import RNFS from 'react-native-fs';
import axios from 'axios';
import Sound from 'react-native-sound';
import { CLIENT_ID } from '../config';

class Player {

    @observable playing = false;
    @observable song = {};
    @observable playlist = {};
    @observable loaded = 0;
    @observable tick = 500;

    filename;
    whoosh;
    timer;

    download() {

        var song = self.song;

        self.filename = `${Sound.CACHES}/${song.title}`;

        return new Promise((resolve, reject) => {

            RNFS.downloadFile({
                fromUrl: `${song.streamUrl}?client_id=${CLIENT_ID}`,
                toFile: self.filename,
                progress: (state) => {
                    self.loaded = state.bytesWritten / state.contentLength;

                    if (self.loaded === 1) {
                        resolve();
                    }
                }
            });
        });
    }

    @action toggle() {
        self.playing = !self.playing;
    }

    @action async start() {

        var whoosh = self.whoosh;

        if (whoosh) {
            whoosh.stop();
        }

        await self.download();

        whoosh = new Sound(self.filename, '', err => {
            if (err) {
                console.error('Failed to load the sound', err);
            } else {

                self.timer = setTimeout(function playing() {
                    self.tick += 500;
                    setTimeout(playing, 500);
                }, 500);

                whoosh.play(success => {

                    if (!success) {
                        whoosh.stop();
                    }
                });
            }
        });

        self.playing = true;
    }

    @action stop() {

        var { whoosh, timer } = this;
        if (whoosh) {
            whoosh.stop();
        }

        clearTimeout(timer);
        self.loaded = 0;
        self.tick = 0;
        self.playing = false;
        self.song = {};
    }

    @action setPlayer(player) {

        var { song, playlist } = player;

        self.stop();
        self.song = song;
        self.playlist = playlist;

    }
}

const self = new Player();
export default self;
