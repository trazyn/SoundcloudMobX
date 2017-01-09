
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
        var playing = self.playing = !self.playing;

        if (playing) {
            self.whoosh.play();
        } else {
            self.whoosh.pause();
        }
    }

    @action async start() {

        if (self.playing) {
            return;
        }

        self.playing = true;

        await self.download();

        self.whoosh = new Sound(self.filename, '', err => {

            var whoosh = self.whoosh;

            if (err) {
                console.error('Failed to load the sound', err);
            } else {

                var tick = 0;
                self.timer = setTimeout(function playing() {
                    whoosh.getCurrentTime(seconds => tick = seconds * 1000);
                    self.tick = tick;
                    self.timer = setTimeout(playing, 500);
                }, 500);

                whoosh.play(success => {
                    success && whoosh.stop();
                });
            }
        });
    }

    @action stop() {

        var { whoosh, timer } = self;

        if (whoosh) {
            whoosh.stop();
            whoosh.release();
        }

        clearTimeout(timer);
        self.loaded = 0;
        self.tick = 0;
        self.song = {};
        self.playing = false;
    }

    @action setup(data) {

        var { song, playlist } = data;

        if (song.id !== self.song.id) {
            self.stop();
            self.song = song;
        }
        self.playlist = playlist;

    }
}

const self = new Player();
export default self;
