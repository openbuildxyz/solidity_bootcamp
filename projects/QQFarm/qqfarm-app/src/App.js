import logo from "./logo.svg";
import "./App.css";
import { Game } from "./view/game";
import { Demo } from "./view/demo";
import { Box } from "@mui/joy";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "90%",
          }}
        >
          <ConnectButton />
        </Box>
        <Demo />
      </header>
    </div>
  );
}

export default App;
