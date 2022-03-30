import { Router } from "./Router";
import { Header } from "./components/Header";
import { UserContextProvider } from "./contexts/UserContext";
import './App.css';
import { TokenContextProvider } from "./contexts/TokenContext";


export default function App() {
    return (
        <TokenContextProvider>
            <UserContextProvider>
                <Header />
                <Router />
                <div id="dz-root"></div>
            </UserContextProvider>
        </TokenContextProvider>
    );
}