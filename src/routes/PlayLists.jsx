import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Spotify } from "../api/spotify";
import { PlaylistRow } from "../components/PlaylistRow";
import { UserContext } from "../contexts/UserContext";

const Wrapper = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5pxpx;
    max-height: 70vh;
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.5);
    width: 50vw;

    & input {
        height: 1.3em;
        width: 1.3em;
        margin: 0 5px;
    }
`;

const TableHeader = styled.div`
    display: flex;
    justify-content: space-around;
    margin: 20px 0px;
`;

const TableHeaderInput = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding: 15px 5px; */
`

const Loader = styled.div`
    text-align: center;
    font-weight: bold;
    letter-spacing: 2px;
`;

const Table = styled.table`
    text-align: left;
    border-collapse: collapse;
    width: 100%;
    text-shadow: 0 0 5px black;
    font-weight: bold;
`;

const H1 = styled.h1`
    text-align: center;
`

const H2 = styled.h2`
    text-align: center;
`

const SpotifyButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    box-shadow: 0px 0px 10px #b04f35;
    border-radius: 5px;
    color: #dfe8da;
    padding: 5px 10px;
    text-shadow:
        0 0 7px #b04f35,
        0 0 10px #b04f35,
        0 0 21px #b04f35,
        0 0 42px #dfe8da,
        0 0 82px #dfe8da,
        0 0 92px #dfe8da,
        0 0 102px #dfe8da,
        0 0 151px #dfe8da;
    font-weight: bold;

    &:hover {
        color: #b04f35;   
    }
    & img {
        width: 32px;
        margin: 0 10px;
    }
`
export function PlayLists() {
    const DZ = window.DZ;
    const contexte = useContext(UserContext);
    const [playlists, setPlaylists] = useState([]);
    const [playlistSelected, setplaylistSelected] = useState([]);
    const [checkedState, setCheckedState] = useState([]);
    const [creating, seCreating] = useState({
        total: 0,
        current: 0,
        isLoading: false,
    });

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        DZ.api('user/me/playlists', 'GET', function(response){
            const playlists = response.data;
            const checkedState = new Array(playlists.length).fill(false);
            setPlaylists(playlists);
            setCheckedState(checkedState);
        });
    }, [DZ]);

    const onSelectAll = (e) => {
        let allPlaylist = [];
        let checkedState = new Array(playlists.length).fill(false);
        if (e.target.checked) {
            allPlaylist = playlists.map(p=>{ 
                const {title, description, tracklist} = p;
                return {title, description, tracklist, public: p.public}
            });
            checkedState = new Array(playlists.length).fill(true);
        }
        setplaylistSelected(allPlaylist);
        setCheckedState(checkedState);
    }

    const onCheckedHandler = (e, playlist) => {
        const selectedPlaylists = [...playlistSelected];
        const copyCheckedState = [...checkedState];
        const {title, description, tracklist} = playlist;
        let index;
        if (e.target.checked) {
            selectedPlaylists.push({title, description, tracklist, public: playlist.public});
        } else {
            index = selectedPlaylists.findIndex(p => p.tracklist === tracklist);
            if (index !== -1) selectedPlaylists.splice(index, 1);
        }
        index = playlists.findIndex(p=>p.tracklist === tracklist);
        copyCheckedState[index] = e.target.checked;
        setplaylistSelected(selectedPlaylists);
        setCheckedState(copyCheckedState);
    }

    const exportToSpotify = async () => {
        seCreating(c => {return {...c, isLoading: true, total: playlistSelected.length}});
        console.log("copyCreating.isLoading: ", creating.isLoading );
        let response = await Spotify.getPlaylists();
        const spotifyPlaylists = response.data.items.map(p => p.name);
        console.log("spotifyPlaylists: ", spotifyPlaylists);
        for(const playlist of playlistSelected) {
            seCreating(c => {return {...c, current: c.current+1}});
            console.log("playlist.title: ", playlist.title);
            console.log("spotifyPlaylists: ", spotifyPlaylists);
            console.log("spotifyPlaylists.includes(playlist.title): ", spotifyPlaylists.includes(playlist.title));
            if (spotifyPlaylists.includes(playlist.title)) continue;
            // To avoid 429: Too many requests
            await sleep(1000);
            response = await Spotify.createPlaylist(contexte.spotify, playlist.title, playlist.description, playlist.public);
            const newPlaylist = response.data;
            const URL = playlist.tracklist.split('https://api.deezer.com')[1];
            DZ.api(URL, 'GET', async function(response){
                const tracks = response.data;
                const spotifyTracksID = [];
                for (const track of tracks) {
                    response = await Spotify.searchTrack(track);
                    let resultTotal = response.data.tracks.total;
                    let spotifyTracks = response.data.tracks.items;
                    if (!resultTotal) {
                        response = await Spotify.searchTrack(track, false);
                        spotifyTracks = response.data.tracks.items.filter(
                            t => t.artists.findIndex(a=>a.name.toLowerCase() === track.title.toLowerCase())
                        );
                    }
                    if (spotifyTracks.length) spotifyTracksID.push(spotifyTracks[0].uri);
                }
                response = await Spotify.addTrackToPlaylist(newPlaylist.id, spotifyTracksID);
            });
        }

        seCreating(c => {
            return {...c, isLoading: false, total: 0, current: 0}
        });
        console.log("copyCreating.isLoading: ", creating.isLoading );
    }

    const renderTable = () => {
        if (playlists.length) {
            return (
                <Wrapper>
                    <TableHeader>
                        <TableHeaderInput>
                            <input type="checkbox" name="playlistSelected" id="select-all" onChange={onSelectAll}/>
                            <label htmlFor="select-all">Tout selectionner</label>
                        </TableHeaderInput>
                        <div>
                            <SpotifyButton onClick={exportToSpotify}>
                                Exporter vers spotify
                                <img src="/assets/spotify_without_text.png" alt="logo spotify without text" />
                            </SpotifyButton>
                        </div>
                    </TableHeader>
                    <Table>
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Nom</th>
                                <th>Nombre de titres</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                playlists.map((playlist, i) => <PlaylistRow key={playlist.id} playlist={playlist} onSelect={onCheckedHandler} checked={checkedState[i]}/>)
                            }
                        </tbody>
                    </Table>
                </Wrapper>
            );
        }
        return <H2>Aucune playlist disponible</H2>
    }

    return (
        <>
        <H1>Gérer les playlists</H1>
        {
            creating.isLoading && (
                <Loader>
                    <img width={128} src="/assets/_______.gif" alt="waiting, playlists are creating" />
                    <p>Playlist {creating.current} / {creating.total}</p>
                </Loader>
            )
        } 
        {
            !creating.isLoading && renderTable()
        }
        </>
    );
}