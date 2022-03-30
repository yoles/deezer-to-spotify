import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { Channel, Home, Login, PlayLists } from "./routes";

const Background = styled.div`
    background-image: url('/assets/music-bg.jpg');
`;

export function Router() {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/channel" element={<Channel />} />
                <Route path="/playlists" element={<PlayLists />} />
            </Routes>
    );
}