import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const List = ({ games, socket }) => {
	const [completed, setCompleted] = useState(null);
	const [ongoing, setOngoing] = useState(null);

	useEffect(() => {
		setCompleted(games.filter(a => a.status === "OVER").map(a => a.key));
		setOngoing(games.filter(a => a.status === "ACTIVE").map(a => a.key));
	}, [games]);

	return (
		<>
			<button onClick={() => socket.emit("create_game")}>Create a new game</button>

			{ongoing?.length > 0 && (
				<div className="games-ongoing">
					<div>Ongoing</div>
					{ongoing.map(id => (
						<Link key={id} to={`/game/${id}`}>
							Game #{id}
						</Link>
					))}
				</div>
			)}

			{completed?.length > 0 && (
				<div className="games-completed">
					<div>Completed</div>
					{completed.map(id => (
						<Link
							key={id}
							to={{
								pathname: `/game/${id}`,
								state: { completed: true }
							}}>
							Game #{id}
						</Link>
					))}
				</div>
			)}
		</>
	);
};

export default List;
