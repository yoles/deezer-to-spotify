// import axios from "axios";
import axios from "axios";
import { SPOTIFY_CREDS } from "../scripts/secret" 

export class Spotify {
    
    static BASE_AUTH_URL = 'https://accounts.spotify.com';
    static BASE_URL = "https://api.spotify.com"
    static ACCESS_TOKEN = this.getAccessToken();
    static HEADER = {}
    static CONTEXT = {}

    static getAuthURL() {
        const code = "token"
        const scope = "playlist-modify-private%20playlist-read-collaborative%20playlist-read-private%20playlist-modify-public%20user-library-modify%20user-library-read"
        const AUTH_URL = `${this.BASE_AUTH_URL}/authorize?client_id=${SPOTIFY_CREDS.CLIENT_ID}&response_type=${code}&redirect_uri=${SPOTIFY_CREDS.REDIRECT_URI}&scope=${scope}`
        return AUTH_URL;
    }
    
    static _getTokenUrl() {
        const URL = `${this.BASE_AUTH_URL}/api/token`;
        return URL;
    }

    static getAccessToken() {
        const token = window.localStorage.getItem("spotify_token")
        return token;
    }

    static getLocalStorageToken() {
        const token = window.localStorage.getItem("spotify_token");
        return token;
    }

    static getHashAccessToken(context=null) {
        let token = this.getLocalStorageToken();
        if (token) return token;

        const hash = window.location.hash
        if (!hash) return null;
    
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
        window.location.hash = "";
        window.localStorage.setItem("spotify_token", token);
        this.ACCESS_TOKEN = token;
        this._setHeader();
        if (context) {
            this.registerUserInContext(context.spotify, token);
            this.getUserProfile(context.spotify);
        }
        return token;
    }

    static logout(context=null) {
        window.localStorage.removeItem("spotify_token");
        window.location.hash = "";
        if (context) context.spotify.setUser({});
        return this.getLocalStorageToken();
    }

    static registerUserInContext(context, token) {
        context.setUser(oldUser => {return {...oldUser, token: token}});
    }

    static _setHeader() {
        this.HEADER = {
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            }
        }
    }

    static setContext(context) {
        this.CONTEXT = context
    }

    static async getUserProfile(context=null) {
        if (!this.HEADER.headers) {
            this._setHeader();
        }
        const PROFILE_URL = `${this.BASE_URL}/v1/me`;
        const response = await axios.get(PROFILE_URL, this.HEADER);
        const spotifyUser = response.data;
        if (context) {
            context.setUser(oldUser => {
                if (!oldUser.token) oldUser.token = this.getLocalStorageToken();
                return {...spotifyUser, token: oldUser.token}
            });
        }
    }

    static getPlaylists(limit=50) {
        if (!this.HEADER.headers) {
            this._setHeader();
        }
        const URL = `${this.BASE_URL}/v1/me/playlists?limit=${limit}`;
        return axios.get(URL, this.HEADER);
    }
    
    static createPlaylist(context, name, description, isPublic=false) {
        if (!this.HEADER.headers) {
            this._setHeader();
        }
        const userID = context.user.id;
        const URL = `${this.BASE_URL}/v1/users/${userID}/playlists`;
        const data = {
            name,
            description,
            public: isPublic,
        }
        return axios.post(URL, data, this.HEADER);
    }

    static searchTrack(track, withArtist=true) {
        if (!this.HEADER.headers) {
            this._setHeader();
        }
        const title = encodeURIComponent(track.title);
        const artist = encodeURIComponent(track.artist.name);
        let query = `track:${title}`;
        if (withArtist)  query += `+artist:${artist}`;
        const URL = `${this.BASE_URL}/v1/search?q=${query}&type=${track.type}`;
        return axios.get(URL, this.HEADER);
    }

    static addTrackToPlaylist(playlistID, tracksID) {
        if (!this.HEADER.headers) {
            this._setHeader();
        }
        const URL = `${this.BASE_URL}/v1/playlists/${playlistID}/tracks`;
        return axios.post(URL, tracksID, this.HEADER);
    }
}