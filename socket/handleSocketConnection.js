const { games, createGame, hasPlayer, checkFullOrAdd, removePlayer } = require("../state/games");
const { players } = require("../state/players");

module.exports = (socket, io) => {
	const getMeta = games => {
		return Array.from(games.entries()).map(([key, state]) => {
			return {
				key,
				status: state.winner ? "OVER" : "ACTIVE"
			};
		});
	};

	//join event handler
	socket.on("join", ({ name, gameID }, callback) => {
		if (!games.get(+gameID)) return callback({ uncreated: true });

		if (hasPlayer(name, +gameID)) return callback({ exists: true });

		if (checkFullOrAdd(name, +gameID)) return callback({ full: true });

		players[name] ? null : (players[name] = 0);

		socket.join(gameID);

		socket.broadcast.to(gameID).emit("new_opponent", { name, gameState: games.get(+gameID) });

		callback();
	});

	//join games list room event handler
	socket.on("join_list_room", (_, callback) => {
		socket.join("list_room");

		callback({
			games: getMeta(games)
		});
	});

	//create game event handler
	socket.on("create_game", () => {
		createGame();
		io.to("list_room").emit("new_games", { games: getMeta(games) });
	});

	//get opponent and state event handler
	socket.on("get_opponent_and_state", ({ name, gameID }, callback) =>
		callback({ state: games.get(+gameID), opponent: games.get(+gameID).players.find(player => player !== name) })
	);

	//play turn and send out state update event handler
	socket.on("turn_played", ({ gameID, state }) => {
		games.set(+gameID, state);
		socket.broadcast.to(gameID).emit("state_update", { state });

		if (!state.winner) return;

		players[state.winner]++;
		io.to("list_room").emit("new_games", { games: getMeta(games) });
	});

	//get game state event handler
	socket.on("get_game_state", ({ gameID }, callback) => callback({ game: games.get(+gameID) }));

	//disconnect event handler
	socket.on("remove", ({ name, gameID }) => {
		if (!games.get(+gameID)) return;

		if (games.get(+gameID).winner) return;

		removePlayer(name, +gameID);
		socket.broadcast.to(gameID).emit("opponent_left");
	});
};
