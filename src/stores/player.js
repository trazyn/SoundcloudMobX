
import { observable, action } from 'mobx';
import Sound from 'react-native-audio-streaming';
import { ReactNativeAudioStreaming } from "react-native-audio-streaming";
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { CLIENT_ID, PLAYER_MODE } from '../config';
import { DeviceEventEmitter } from 'react-native';

class Player {

    @observable song = {};
    @observable playlist = [];
    @observable progress = 0;
    @observable mode = PLAYER_MODE[0];
    @observable playing = false;
    @observable paused = false;

    history = [];

    async stop() {
        ReactNativeAudioStreaming.stop();
    }

    @action reset() {

        self.stop();
        self.paused = false;
        self.playing = false;
    }

    @action toggle() {

        if (self.paused) {
            ReactNativeAudioStreaming.resume();
        } else {
            ReactNativeAudioStreaming.pause();
        }

        self.paused = !self.paused;
    }

    @action async start({ song, playlist = self.playlist, needTrack = true }) {

        if (self.song.id === song.id
            && self.playlist.uuid === playlist.uuid) {

            if (self.paused) {
                self.toggle();
            }

            if (self.playing) {
                return;
            }
        }

        if (self.song.id !== song.id) {

            self.stop();
            self.song = song;
        }

        if (self.playlist.uuid !== playlist.uuid) {
            self.history = [];
            self.playlist = playlist;
        }

        needTrack && self.history.push(song);

        var response = axios.get(song.uri + '/streams', {
            params: {
                client_id: CLIENT_ID,
            }
        }).catch(ex => {
            self.next();
        });
        var streamurl = (await response).data.http_mp3_128_url;

        self.paused = false;
        self.paying = true;
        ReactNativeAudioStreaming.play(streamurl, { showIniOSMediaCenter: true });
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

        self.reset();
        self.start({ song });
    }

    @action prev() {

        var song = self.history[self.history.length - 2];

        if (!song) {
            song = self.history[0];
        } else {
            self.history.pop();
        }

        self.reset();
        self.start({ song, needTrack: false });
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

            self.playing = ['PLAYING', 'BUFFERING', 'PAUSED', 'STREAMING'].includes(status);

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
