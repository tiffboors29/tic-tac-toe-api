const express = require("express");
const game = require('./game');

const app = express();

app.use(express.static('asset'))

app.get('/', (req, res, next) => {
	let board = req.query.board.split('');
	if (board){
		let winner = game.checkWinner(board);
		if (winner){
			res.json({ success: true, data: `Winner is ${winner}` });
		}
		else if (game.isBoardValid(board) && game.isOTurn(board)){
			let newBoard = game.takeTurn(board);
			res.send(newBoard.join(','));
		}
		else {
			handleError(next);
		}
	}
	else {
		handleError(next);
	}

	function handleError (next){
		const err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));