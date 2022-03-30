import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spotify } from "../api/spotify";
import { TokenContext, UserContext } from "../contexts";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;

    & a:hover {
        text-decoration: none;
        /* color: black; */
        border-radius: 5px;
        padding: 10px 20px;
        box-shadow: 0px 0px 10px #b04f35;
        color: #b04f35;
        text-shadow:
            0 0 7px #b04f35,
            0 0 10px #b04f35,
            0 0 21px #b04f35,
            0 0 42px #dfe8da,
            0 0 82px #dfe8da,
            0 0 92px #dfe8da,
            0 0 102px #dfe8da,
            0 0 151px #dfe8da;
        }
        font-weight: bold;
        letter-spacing: 3px;

    & a {
    text-decoration: none;
    /* color: black; */
    border-radius: 5px;
    padding: 10px 20px;
    box-shadow: 0px 0px 10px #b04f35;
    color: #dfe8da;
    text-shadow:
        0 0 7px #b04f35,
        0 0 10px #b04f35,
        0 0 21px #b04f35,
        0 0 42px #dfe8da,
        0 0 82px #dfe8da,
        0 0 92px #dfe8da,
        0 0 102px #dfe8da,
        0 0 151px #dfe8da;
    }
    font-weight: bold;
    letter-spacing: 3px;
`;

export function Home() {
    const context = useContext(UserContext);
    const { setToken } = useContext(TokenContext);

    useEffect(() => {
        const token = Spotify.getHashAccessToken(context);
        if (token) setToken(token)
    }, []);

    return (
        <>
            <Wrapper>
                <Link to="/playlists">Gérer les playlists</Link>
            </Wrapper>
        </>
    );
}