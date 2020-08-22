import React, { useEffect, useState } from "react";
import Tile from "./Tile";
import io from "socket.io-client";

let socket = null;

const GameResult = ({ gameID }) => {
	const [gameState, setGameState] = useState(null);

	useEffect(() => {
		socket = io(process.env.REACT_APP_SOCKET_ENDPOINT);
		socket.emit("get_game_state", { gameID }, ({ game }) => setGameState(game));

		//eslint-disable-next-line
	}, []);

	return (
		<>
			<div>{`Winner: ${gameState?.winner}`}</div>
			<div className="game-board">
				{gameState?.state?.map((tile, index) => (
					<Tile
						key={index}
						{...{
							tile
						}}
					/>
				))}
			</div>
		</>
	);
};

export default GameResult;
