const express = require("express");
const router = express.Router();
const request = require('request')
const querystring = require("querystring");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect = "http://localhost:8888/callback";



router.get('/login', (req, res) => {
    let scope = "";
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id: clientId,
            scope: scope,
            redirect_uri: redirect,
        }))
})

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
            res.redirect('/home');
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


module.exports = router;
