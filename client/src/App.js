import React, { useState, useEffect } from "react";
import "./style/App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import io from "socket.io-client";
import List from "./components/List";
import Game from "./components/Game";

let socket = null;

const App = () => {
	const [games, setGames] = useState([]);

	useEffect(() => {
		socket = io(process.env.REACT_APP_SOCKET_ENDPOINT);

		socket.emit("join_list_room", null, ({ games }) => setGames(games));

		socket.on("new_games", ({ games }) => setGames(games));
	}, []);

	return (
		<Router>
			<Route exact path="/">
				<List {...{ games, socket }} />
			</Route>
			<Route path="/game/:gameID">
				<Game />
			</Route>
		</Router>
	);
};

export default App;
