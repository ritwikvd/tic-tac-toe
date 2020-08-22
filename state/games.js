const games = new Map();

let id = 0;

const createGame = () => games.set(++id, { players: [], state: new Array(9).fill(""), turn: null, winner: null, sym: "X" });

const hasPlayer = (name, id) => games.get(id).players.includes(name);

const checkFullOrAdd = (name, id) => {
	const game = games.get(id);

	if (game.players.length === 2) return true;

	game.players.push(name);

	if (!game.turn && game.state.find(a => a)) game.turn = name;

	return false;
};

const removePlayer = (name, id) => {
	const game = games.get(id);
	const arr = game.players;
	const index = arr.findIndex(player => player === name);

	arr.splice(index, 1);

	if (game.turn === name) game.turn = null;
};

module.exports = {
	games,
	createGame,
	hasPlayer,
	checkFullOrAdd,
	removePlayer
};
