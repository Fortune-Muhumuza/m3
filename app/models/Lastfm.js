var LastFmNode = require('lastfm').LastFmNode
    , buildUrl = require('build-url');

var keys = {
    public: process.env.LASTFM_PUBLIC || '5871e4edfbb74f88b1f1991387c2a689',
    private: process.env.LASTFM_PRIVATE || '22013114833d372ece6ab6d21b0c0a02'
}

root: 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists';

var lastfm = new LastFmNode({
    api_key: keys.public,
    secret: keys.private,
    useragent: 'musemusic' // optional. defaults to lastfm-node.
});

module.exports = function(username) {
url: buildUrl(root, {
        queryParams: {
            user: username,
            api_key: lastfm.api_key,
            format: 'json'
        }
    })
}