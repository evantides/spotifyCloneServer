const express = require("express");
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi();

router.get("/:type/:term", (req, res) => {
    let specific = [];
    console.log(req.params.type, req.params.term)
    req.params.term.replace('%20', " ")
    switch (req.params.type) {
        case "track":
            spotifyApi.searchTracks(req.params.term).then(function(error, data) {
                console.log(data.body);
                // data.body.tracks.items.map(dataItem => {
                //     specific.push({
                //         trackName: dataItem.name,
                //         artists: dataItem.artists.map(artist => {
                //             return artist.name;
                //         }),
                //         album: {
                //             albumName: dataItem.album.name,
                //             albumImg: dataItem.album.images.map(img => {
                //                 return img.url;
                //             })
                //         }
                //     });
                // });
            }, function(err) {
                console.error(err)
            })
            break;
    }
    res.json(specific);
});

module.exports = router;