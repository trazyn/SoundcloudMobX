
import axios from 'axios';
import { CLIENT_ID } from '../config';

var favCache = {};

export async function isFavorited(userid, songid) {

    if (favCache.hasOwnProperty(songid)) {
        return favCache[songid];
    }

    try {
        var response = await axios.get(`http://api.soundcloud.com/users/${userid}/favorites/${songid}?client_id=${CLIENT_ID}`);
        var res = favCache[songid] = response.data.user_favorite;

        return res;
    } catch(ex) {
        favCache[songid] = false;
        return false;
    }

}

isFavorited.cache = {};

export async function addFavorited(userid, songid) {

    var response = await axios({
        url: `https://api.soundcloud.com/users/${userid}/favorites/${songid}?client_id=${CLIENT_ID}`,
        method: 'put',
    });
    return response.data.user_favorite;
}

export async function removeFavorited(userid, songid) {

    var response = await axios({
        url: `https://api.soundcloud.com/users/${userid}/favorites/${songid}?client_id=${CLIENT_ID}`,
        method: 'delete',
    });
    return response.data.user_favorite;
}
