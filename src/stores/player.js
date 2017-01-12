
import { observable, action } from 'mobx';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { CLIENT_ID, PLAYER_MODE } from '../config';
import { AsyncStorage } from 'react-native';

class Player {

    @observable playing = false;
    @observable song = {};
    @observable playlist = {};
    @observable loaded = 0;
    @observable tick = 500;
    @observable mode = PLAYER_MODE[0];

    quene = [];
    filename;
    whoosh;
    timer;
    downloading;

    loadfile() {

        var song = self.song;

        self.filename = `${Sound.CACHES}/${song.title}.${song.filetype}`;

        return new Promise(async (resolve, reject) => {

            if (self.downloading) {
                await RNFS.stopDownload(self.downloading.jobId);
                self.downloading = null;
            }

            if (await RNFS.exists(self.filename)) {
                self.loaded = 1;
                return resolve();
            }

            self.downloading = RNFS.downloadFile({
                fromUrl: `${song.streamUrl}?client_id=${CLIENT_ID}`,
                toFile: self.filename,
                progress: (state) => {
                    self.loaded = state.bytesWritten / state.contentLength;

                    if (self.loaded === 1) {
                        self.downloading = null;
                        resolve();
                    }
                }
            });

            (((filename, promise) => promise.catch(async ex => RNFS.unlink(filename))))(self.filename, self.downloading.promise);
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

        await self.loadfile();

        return new Promise((resolve, reject) => {

            self.whoosh = new Sound(self.filename, '', err => {

                var whoosh = self.whoosh;

                if (err) {
                    console.error(`Failed to load the sound: ${self.filename}`, err);
                    reject();
                } else {

                    var tick = 0;
                    self.timer = setTimeout(function playing() {
                        whoosh.getCurrentTime(seconds => tick = seconds * 1000);
                        self.tick = tick;
                        self.timer = setTimeout(playing, 500);
                    }, 500);

                    whoosh.play(success => {
                        success && self.next();
                    });

                    resolve();
                }
            });
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

    @action setup(data, needTrack = true) {

        var { song, playlist } = data;

        if (playlist) {
            self.quene = [];
            self.playlist = playlist;
        }

        if (song && song.id !== self.song.id) {
            self.stop();
            self.song = song;

            if (needTrack) {
                self.quene.push(song);
            }
        }
    }

    @action async changeMode() {

        var index = PLAYER_MODE.indexOf(self.mode);

        if (index === -1 || index === PLAYER_MODE.length - 1) {
            self.mode = PLAYER_MODE[0];
        } else {
            self.mode = PLAYER_MODE[++index];
        }

        await AsyncStorage.setItem('@Player:mode', self.mode);
    }

    @action async next() {

        var playlist = self.playlist;
        var index = playlist.findIndex(e => e.id === self.song.id);
        var song;

        if (self.mode === PLAYER_MODE[0]) {

            if (index === playlist.length - 1) {
                song = playlist[0];
            } else {
                song = playlist[index + 1];
            }
        } else {
            var shuffle = new Array(playlist.length - 1);

            shuffle = shuffle.fill(0).map((e, i) => {
                return i < index ? i : ++i;
            });

            song = playlist[Math.floor(Math.random() * shuffle.length)];
        }

        self.setup({
            song
        });
        await self.start();
    }

    @action async prev() {

        var song = self.quene[self.quene.length - 2];

        if (!song) {
            song = self.quene[0];
        } else {
            self.quene.pop();
        }

        self.setup({
            song
        }, false);

        await self.start();
    }

    @action async init() {
        var mode = await AsyncStorage.getItem('@Player:mode');

        if (PLAYER_MODE.includes(mode)) {
            self.mode = mode;
        }
    }
}

const self = new Player();
export default self;
