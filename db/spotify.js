const express = require("express");
const router = express.Router();
const request = require('request')
const querystring = require("querystring");
const SpotifyWebApi = require("spotify-web-api-node");



const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect = "http://localhost:8888/callback";


const spotifyApi = new SpotifyWebApi();

const generateRandomString = length => {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

//Log In to Spotify API using CLient ID and Secret
router.get("/login", (req, res) => {
    let scope = "";
    let state = generateRandomString(16);
    // localStorage.setItem('State', stateKey);
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
});

router.get('/callback', ((req, res) => {
    let code = req.query.code || null;
    let state = req.query.state || null;

    let authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            code: code,
            redirect_uri: redirect,
            grant_type: "authorization_code",
            state: state
        },
        headers: {
            Authorization:
                "Basic " +
                new Buffer(clientId + ":" + clientSecret).toString("base64")
        },
        json: true
    };
    request.post(authOptions, function(error, response, body){
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token,
                refresh_token = body.refresh_token;
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);
            res.redirect('http://localhost:3001/');
        } else {
            res.redirect(
                "/#" +
                querystring.stringify({
                    error: "invalid_token"
                })
            );
        }
    });
}))

router.get("/home", (req, res) => {
    res.send(
        "This is the home screen. To search for an artist, add to the url above a forward slash and the name of the artist you wish to find! It should look like 'localhost:8000/home/drake'!"
    );
});

router.get("/search/:type/:term", (req, res) => {
    let specific = [];
    console.log(req.params.type, req.params.term)
    req.params.term.replace('%20', " ")
    switch (req.params.type) {
        case "track":
            spotifyApi.searchTracks(req.params.term).then(function(error, data) {
                console.log(data.body);
                data.body.tracks.items.map(dataItem => {
                    specific.push({
                        trackName: dataItem.name,
                        artists: dataItem.artists.map(artist => {
                            return artist.name;
                        }),
                        album: {
                            albumName: dataItem.album.name,
                            albumImg: dataItem.album.images.map(img => {
                                return img.url;
                            })
                        }
                    });
                });
            }, function(err) {
                console.error(err)
            })
            break;
    }
    res.json(specific);
});


module.exports = router;
