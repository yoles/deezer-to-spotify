import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserContextProvider(props) {
    const [user, setUser] = useState({});
    const [spotifyUser, setSpotifyUser] = useState({});
    const [deezerUser, setDeezerUser] = useState({});

    const contexte = {
        user:  {user, setUser},
        spotify: {user: spotifyUser, setUser: setSpotifyUser},
        deezer: {user: deezerUser, setUser: setDeezerUser},
    }
    return (
        <UserContext.Provider value={contexte}>
            {props.children}
        </UserContext.Provider>
    );
}