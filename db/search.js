const express = require("express");
const router = express.Router();

const SpotifyWebApi = require("spotify-web-api-node");

router.get("/:type/:term", (req, res) => {
    res.send(
        "This is the home screen. To search for an artist, add to the url above a forward slash and the name of the artist you wish to find! It should look like 'localhost:8000/home/drake'!"
    );
});

module.exports = router;