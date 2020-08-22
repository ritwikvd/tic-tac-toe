import React, { useState, useEffect } from "react";
import Tile from "./Tile";

const GameRoom = ({ socket, name, gameID }) => {
	const [opponent, setOpponent] = useState("");
	const [gameState, setGameState] = useState({});
	const [winner, setWinner] = useState("");

	useEffect(() => {
		socket.on("new_opponent", ({ name, gameState }) => {
			setGameState(gameState);
			setOpponent(name);
		});
		socket.on("opponent_left", () => setOpponent(""));
		socket.on("state_update", ({ state }) => {
			setGameState(state);
			setWinner(state.winner || "");
		});

		socket.emit("get_opponent_and_state", { name, gameID }, ({ opponent, state }) => {
			setOpponent(opponent);
			setGameState(state);
			setWinner(state.winner || "");
		});

		//eslint-disable-next-line
	}, []);

	let checkSum = (index, arr, space) => {
		let sum = 0;
		for (let i = 0, y = index; i < 3; i++, y += space) sum += arr[y];

		return sum === arr[index] * 3 ? true : false;
	};

	const checkForWinner = arr => {
		const indices = [0, 1, 2, 3, 6];

		const numArr = arr.map(a => (a === "X" ? 3 : a === "O" ? 1 : 0));

		for (let index of indices) {
			if (!numArr[index]) continue;

			let boundCheckSum = checkSum.bind(this, index, numArr);
			let done;

			switch (index) {
				case 0:
					done = boundCheckSum(1) || boundCheckSum(3) || boundCheckSum(4) ? true : false;
					break;
				case 1:
					done = boundCheckSum(3) ? true : false;
					break;
				case 2:
					done = boundCheckSum(2) || boundCheckSum(3) ? true : false;
					break;
				case 3:
					done = boundCheckSum(1) ? true : false;
					break;
				case 6:
					done = boundCheckSum(1) ? true : false;
					break;
				default:
					break;
			}

			if (done) return true;
		}

		return false;
	};

	const updateState = index => {
		gameState.state.splice(index, 1, gameState.sym);

		const wins = checkForWinner(gameState.state);

		const draw = wins ? false : gameState.state.find(a => a === "") === "" ? false : true;

		const newState = {
			...gameState,
			sym: gameState.sym === "X" ? "O" : "X",
			turn: opponent,
			winner: wins ? name : draw ? "Draw" : null
		};

		socket.emit("turn_played", { gameID, state: newState });

		setGameState(newState);

		setWinner(wins ? name : draw ? "Draw" : "");
	};

	return (
		<>
			<div>{winner ? `Winner: ${winner}` : opponent ? `Playing against: ${opponent}` : "Awaiting a new player"}</div>
			<div className="game-board">
				{gameState.state?.map((tile, index) => (
					<Tile
						key={index}
						{...{
							turn: (gameState.turn === name || gameState.turn === null) && opponent && !gameState.winner ? true : false,
							tile,
							sym: gameState.sym,
							updateState: updateState.bind(this, index)
						}}
					/>
				))}
			</div>
		</>
	);
};

export default GameRoom;
