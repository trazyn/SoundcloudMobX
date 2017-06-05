
import { observable, action } from 'mobx';
import Sound from 'react-native-audio-streaming';
import { ReactNativeAudioStreaming } from "react-native-audio-streaming";
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { CLIENT_ID, PLAYER_MODE } from '../config';
import { DeviceEventEmitter } from 'react-native';

class Player {

    @observable playing = false;
    @observable song = {};
    @observable playlist = [];
    @observable progress = 0;
    @observable mode = PLAYER_MODE[0];

    paused = false;
    quene = [];

    async stop() {

        ReactNativeAudioStreaming.stop();
        self.playing = false;
    }

    @action toggle() {
        var playing = self.playing = !self.playing;

        if (playing) {
            ReactNativeAudioStreaming.resume();
        } else {
            ReactNativeAudioStreaming.pause();
        }

        self.paused = !self.paused;
    }

    @action async start() {

        if (self.playing) {
            return;
        }

        if (self.paused) {
            return self.toggle();
        }

        self.playing = true;
        self.paused = false;

        var song = self.song;
        var response = axios.get(song.uri + '/streams', {
            params: {
                client_id: CLIENT_ID,
            }
        }).catch(ex => {
            self.next();
        });
        var fromUrl = (await response).data.http_mp3_128_url;

        ReactNativeAudioStreaming.play(fromUrl, { showIniOSMediaCenter: true });
    }

    @action setup(data, needTrack = true) {

        var { song, playlist } = data;

        if (playlist) {
            self.quene = [];
            self.playlist = playlist;
        }

        if (song && song.id !== self.song.id) {
            self.song = song;
            self.stop();

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

        self.setup({ song });
        self.start();
    }

    @action prev() {

        var song = self.quene[self.quene.length - 2];

        if (!song) {
            song = self.quene[0];
        } else {
            self.quene.pop();
        }

        self.setup({ song }, false);
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

        DeviceEventEmitter.addListener('AudioBridgeEvent', e => {

            var { status, duration, progress, url } = e;

            if ('ERROR' === status) {
                self.stop();
                throw e;
            }

            if ('STREAMING' === status) {
                return self.progress = progress / duration;
            }

            if (['BUFFERING', 'STOPPED'].includes(status)) {
                self.progress = 0;

                if ('STOPPED' === status && url) {
                    //self.next();
                }
            }
        });
    }
}

const self = new Player();
export default self;
