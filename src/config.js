
const CLIENT_ID = 'BBgtXkQTDWKAu0R0DbI2qXrhE5xjg9n4';
const SECRET = 'TDnKAMed2vo2RomIthpq9CR2GP096eMw';

const GENRES_MAP = [
    'house',
    'chill',
    'deep',
    'dubstep',
    'progressive',
    'tech',
    'trance',
    'tropical',
];

const TAG_MAP = [
    'house',
    'trance',
    'dubstep',
];

const CHART_GENRES_MAP = [{
    name: 'Alternative Rock',
    key: 'alternativerock',
}, {
    name: 'Ambient',
    key: 'ambient'
}, {
    name: 'Classical',
    key: 'classical'
}, {
    name: 'Country',
    key: 'country'
}, {
    name: 'Dance & EDM',
    key: 'danceedm'
}, {
    name: 'Dancehall',
    key: 'dancehall'
}, {
    name: 'Deep House',
    key: 'deephouse'
}, {
    name: 'Disco',
    key: 'disco'
}, {
    name: 'Drum & Bass',
    key: 'drumbass'
}, {
    name: 'Dubstep',
    key: 'dubstep'
}, {
    name: 'Electronic',
    key: 'electronic'
}, {
    name: 'Folk & Singer-Songwriter',
    key: 'folksingersongwriter'
}, {
    name: 'Hip-hop & Rap',
    key: 'hiphoprap'
}, {
    name: 'House',
    key: 'house'
}, {
    name: 'Indie',
    key: 'indie'
}, {
    name: 'Jazz & Blues',
    key: 'jazzblues'
}, {
    name: 'Latin',
    key: 'latin'
}, {
    name: 'Metal',
    key: 'metal'
}, {
    name: 'Piano',
    key: 'piano'
}, {
    name: 'Pop',
    key: 'pop'
}, {
    name: 'R&B & Soul',
    key: 'rbsoul'
}, {
    name: 'Reggae',
    key: 'reggae'
}, {
    name: 'Reggaeton',
    key: 'reggaeton'
}, {
    name: 'Rock',
    key: 'rock'
}, {
    name: 'Soundtrack',
    key: 'soundtrack'
}, {
    name: 'Techo',
    key: 'techno'
}, {
    name: 'Trance',
    key: 'trance'
}, {
    name: 'Trap',
    key: 'trap'
}, {
    name: 'Triphop',
    key: 'triphop'
}, {
    name: 'World',
    key: 'world'
}];

const PLAYER_MODE = [
    'LOOP',
    'SHUFF',
];

const IMAGE_SIZES = {
    LARGE: 't300x300',
    XLARGE: 't500x500',
};

/** Debug network in chrome devtools network tab */
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

console.ignoredYellowBox = ['Warning: ReactNative.createElement', 'Possible Unhandlerd Promise ', 'Remote debugger', 'View '];

export { CLIENT_ID, SECRET, GENRES_MAP, TAG_MAP, CHART_GENRES_MAP, PLAYER_MODE, IMAGE_SIZES };
