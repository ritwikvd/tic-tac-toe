import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams, useLocation } from "react-router-dom";
import GameRoom from "./GameRoom";
import GameResult from "./GameResult";

let socket = null;

const Game = () => {
	const { gameID } = useParams();
	const location = useLocation();

	const [name, setName] = useState("");
	const [permitted, setPermitted] = useState(false);

	const refName = useRef(name);

	useEffect(() => {
		refName.current = name;
	}, [name]);

	useEffect(() => {
		socket = io(process.env.REACT_APP_SOCKET_ENDPOINT);

		const closeSocket = () => {
			socket.emit("remove", { name: refName.current, gameID });
			socket.disconnect();
		};

		window.addEventListener("beforeunload", closeSocket);

		return closeSocket;

		//eslint-disable-next-line
	}, []);

	const handleSubmit = e => {
		e.preventDefault();

		socket.emit("join", { name, gameID }, ({ uncreated, full, dup } = {}) => {
			dup && alert("Player with that username is already in this game");
			full && alert("Game room is full");
			uncreated && alert("Incorrect URL");
			setPermitted(uncreated || dup || full ? false : true);
		});
	};

	if (location?.state?.completed) return <GameResult {...{ gameID }} />;

	if (!permitted)
		return (
			<form className="form-username" onSubmit={handleSubmit}>
				<input type="text" placeholder="Enter a username" value={name} onChange={e => setName(e.target.value)} required autoFocus />
			</form>
		);

	return <GameRoom {...{ socket, name, gameID }} />;
};

export default Game;
