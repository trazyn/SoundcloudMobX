
import { observable, action } from 'mobx';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { CLIENT_ID, PLAYER_MODE } from '../config';

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

            var fromUrl = song.streamUrl;

            if (self.downloading) {
                await RNFS.stopDownload(self.downloading.jobId);
                self.downloading = null;
            }

            if (await RNFS.exists(self.filename)) {
                self.loaded = 1;
                return resolve();
            }

            if (!fromUrl) {
                let response = axios.get(song.uri + '/streams', {
                    params: {
                        client_id: CLIENT_ID,
                    }
                }).catch(ex => console.err(`Failed to get stream: ${song.uri}`));
                let data = (await response).data;

                fromUrl = data.http_mp3_128_url;
            } else {
                fromUrl = `${fromUrl}?client_id=${CLIENT_ID}`;
            }

            self.downloading = RNFS.downloadFile({
                fromUrl,
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

    isPaused() {
        return self.tick && self.quene.slice(-1)[0] === self.song;
    }

    stop() {

        var { whoosh, timer } = self;

        self.loaded = 0;
        self.tick = 0;
        self.song = {};
        self.playing = false;
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

        if (self.isPaused()) {
            return self.whoosh.play();
        }

        await self.loadfile();

        if (self.whoosh) {
            self.whoosh.stop();
            self.whoosh.release();
        }

        self.whoosh = new Sound(self.filename, '', async err => {

            var whoosh = self.whoosh;

            if (err) {
                await RNFS.unlink(self.filename);
                self.next();
            } else {

                var tick = 0;
                clearTimeout(self.timer);
                self.timer = setTimeout(function playing() {
                    whoosh.getCurrentTime(seconds => {
                        tick = seconds * 1000;

                        /** Sometimes the play callback is not invoked by 'react-native-sound', we need check current time */
                        if (seconds === 0) {
                            return self.next();
                        }
                    });
                    self.tick = tick;
                    self.timer = setTimeout(playing, 500);
                }, 500);

                whoosh.play(success => {

                    if (success) {
                        self.next();
                    } else {
                        self.stop();
                        console.error(`Failed to play: ${self.filename}`);
                    }
                });
            }
        });
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

    @action next() {

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
        self.start();
    }

    @action prev() {

        var song = self.quene[self.quene.length - 2];

        if (!song) {
            song = self.quene[0];
        } else {
            self.quene.pop();
        }

        self.setup({
            song
        }, false);

        self.start();
    }

    @action appendPlaylist(songs) {
        self.playlist.push(...songs);
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
