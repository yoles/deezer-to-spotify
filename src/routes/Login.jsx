import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Spotify } from "../api/spotify";
import { TokenContext, UserContext } from "../contexts";
import initConfig from "../scripts/secret";

const Wrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & .buttons {
        display: flex;
        align-items: center;
    }

    & img {
        width: 128px;
    }

    & h2{
        text-align: center;
        width: 30%;
        margin: auto;
        padding: 5px 10px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.5);
        text-shadow: 0 0 5px black;
    }
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;
    text-decoration: none;
    color: black;
    margin: 20px;
    min-height: 65px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px black;
    padding: 0 15px;
    background-color: rgba(211, 211, 211, 0.5);
`;

const SpotifyButton = styled(Button)`
    filter: contrast(300%);
`;

export function Login() {
    const DZ = window.DZ;
    const context = useContext(UserContext);
    const { setToken } = useContext(TokenContext);
    const [loginErrorMessage, setloginErrorMessage] = useState('');

    const logoutSpotify = () => {
        const emptyToken = Spotify.logout(context);
        setToken(emptyToken);
    };

    const loginDeezer = () => {
        DZ.login(function(response) {
            const user = {
                accessToken:  response.authResponse.accessToken,
                profile: {}
            };
            if (response.authResponse) {
                DZ.api('/user/me', function(response) {
                    user.profile = response;
                    context.deezer.setUser(user);
                });
                localStorage.setItem("deezer_token", response.authResponse.accessToken)
            } else {
                setloginErrorMessage("l'utilisateur à annulé la demande de connexion ou n'est pas complétement authorisé.");
            }
        }, {perms: 'basic_access,email'});
    }

    useEffect(() => {
        DZ.init(initConfig);
        // // Then, request the user to log in
        try {
            DZ.api('/user/me', function(response){
                console.log("My name", response.name);
            })
        } catch (error){
            console.error("Erreur: ", error);
            logoutSpotify();
        }
            
            
    }, [DZ]);

    return (
        <>
            {
                loginErrorMessage && <div>{loginErrorMessage}</div>
            }

            <Wrapper>
                <h2>Connexion</h2>           
                <div className="buttons">
                        {
                            context.deezer.user.profile?.id ? 
                                <Button onClick={null}>
                                    Déconnexion Deezer   
                                </Button>
                            :
                                <Button onClick={loginDeezer}>
                                    <img src="/assets/deezer.png" alt="" />
                                </Button>
                        }
                        {
                            context.spotify.user.id ? 
                                <SpotifyButton onClick={logoutSpotify}>
                                    <span>Déconnexion Spotify</span>  
                                </SpotifyButton>
                            : 
                                <SpotifyButton as="a" href={Spotify.getAuthURL()}>
                                    <img src="/assets/spotify.png" alt="" />
                                </SpotifyButton>
                        }
                </div>
            </Wrapper>
        </>
    );
}