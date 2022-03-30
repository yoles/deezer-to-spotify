import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Spotify } from "../api/spotify";
import { UserContext } from "../contexts";

const Wrapper = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-family: 'Courier New', Courier, monospace;
    min-height: 70px;
    box-shadow: 0px 0px 10px black;
    position: relative;

    & a{
        color: white;
        text-decoration: none;
        display: inline-block;
        padding: 5px 10px;
    }

    & li a.active {
        border-bottom: 1px solid white;
    }

    & h2 {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
`;

const Navigation = styled.nav`
    
`;

const NavList = styled.ul`
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0;
    letter-spacing: 3px;
    font-weight: bold;
`;

const NavItem = styled.li`
    margin: 5px 15px;
`;

const ProfilesText = styled.p`
    display: none;
`;

const ProfilesImg = styled.img`
    border-radius: 50%;
    margin: auto;
`;

const ProfileInfo = styled.div`
    margin: 5px;
`;

const Profiles = styled.div`
    display: flex;

    &:hover ${ProfilesText} {
        display: block;
    }

    &:hover ${ProfileInfo} {
        text-align: center;
    }
`



export function Header() {
    const { deezer, spotify } = useContext(UserContext);

    useEffect(() => {
        Spotify.getUserProfile(spotify);
    }, []);

    return (
        <Wrapper>
            <Navigation>
                <NavList>
                    <NavItem>
                        <NavLink to="/">Accueil</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/login">Connexion</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/playlists">Playlists</NavLink>
                    </NavItem>
                </NavList>
            </Navigation>
            <h2>Deezer to Spotify</h2>
            <Profiles>

                {
                    deezer.user.profile && 
                    <ProfileInfo title={`${deezer.user.profile.name} (Deezer)`} >
                        <ProfilesImg src={deezer.user.profile.picture_small} alt={`profile ${deezer.user.profile?.name}`}/>
                        {/* <ProfilesText>{deezer.user.profile.name}</ProfilesText> */}
                    </ProfileInfo>
                    
                }
                {
                    spotify.user.images && 
                    <ProfileInfo title={`${spotify.user.display_name} (Spotify)`}>
                        <ProfilesImg width={56} src={spotify.user.images[0].url} alt={`profile ${spotify.user.display_name}`}/>
                        {/* <ProfilesText>{}</ProfilesText> */}
                    </ProfileInfo>
                }
            </Profiles>
        </Wrapper>
    );
}