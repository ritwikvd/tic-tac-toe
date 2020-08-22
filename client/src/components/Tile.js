import React, { useState, useEffect } from "react";

const Tile = ({ turn, tile, sym, updateState }) => {
	const [symbol, setSymbol] = useState(tile);

	useEffect(() => {
		setSymbol(tile);
	}, [tile]);

	const handleClick = () => {
		if (tile || !turn) return;

		setSymbol(sym);

		updateState();
	};

	return (
		<div className={turn ? "turn" : ""} onClick={handleClick}>
			{symbol}
		</div>
	);
};

export default Tile;
