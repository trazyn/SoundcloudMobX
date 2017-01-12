
export default (song) => {

    return {
        title: song.title,
        id: song['id'],
        artwork: (song['artwork_url'] || '').replace(/\large\./, 't500x500.'),
        duration: song['duration'],
        kind: song['kind'],
        commentCount: song['comment_count'],
        likesCount: song['likes_count'],
        playbackCount: song['playback_count'],
        created: +new Date(song['created_at']),
        desc: song['description'],
        genre: song['genre'],
        labelId: song['label_id'],
        lableNumber: song['label_name'],
        release: song['release'],
        releaseDay: song['release_day'],
        releaseMonth: song['release_month'],
        releaseYear: song['release_year'],
        streamable: song['streamable'],
        streamUrl: song['stream_url'],
        taglist: song['tag_list'],
        uri: song['uri'],
        fav: song['user_favorite'],
        user: song['user'],
        filetype: song['original_format'],
        waveform: song['waveform_url'],
    };
};
