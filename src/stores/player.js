
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

    filename;
    whoosh;
    timer;
    downloader;

    loadfile() {

        var song = self.song;

        self.filename = `${Sound.CACHES}/${song.title}.${song.filetype}`;

        return new Promise(async (resolve, reject) => {

            if (await RNFS.exists(self.filename) || false) {
                self.loaded = 1;
                resolve();
            }

            self.downloader = RNFS.downloadFile({
                fromUrl: `${song.streamUrl}?client_id=${CLIENT_ID}`,
                toFile: self.filename,
                progress: (state) => {
                    self.loaded = state.bytesWritten / state.contentLength;

                    if (self.loaded === 1) {
                        resolve();
                    }
                }
            });

            self.downloader.promise.catch(ex => ex);
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
                    success && self.next();
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

        if (song && song.id !== self.song.id) {
            self.stop();
            self.song = song;
        }

        if (playlist) {
            self.playlist = playlist;
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

    async shuffle(playlist, index) {

        var shuffle = new Array(playlist.length - 1);

        if (self.downloader) {
            await RNFS.stopDownload(self.downloader.jobId);
        }

        shuffle = shuffle.fill(0).map((e, i) => {
            return i < index ? i : ++i;
        });

        return playlist[Math.floor(Math.random() * shuffle.length)];
    }

    async cursor(offset = 1) {

        var playlist = self.playlist;
        var index = playlist.findIndex(e => e.id === self.song.id);
        var song;

        if (self.mode === PLAYER_MODE[0]) {

            if (index === playlist.length - 1) {
                song = playlist[0];
            } else {
                song = playlist[index + offset];
            }
        } else {
            song = await self.shuffle(playlist, index);
        }

        self.setup({
            song
        });
        self.start();
    }

    @action next = () => this.cursor(+1);
    @action prev = () => this.cursor(-1);

    @action async init() {
        var mode = await AsyncStorage.getItem('@Player:mode');

        if (PLAYER_MODE.includes(mode)) {
            self.mode = mode;
        }
    }
}

const self = new Player();
export default self;
