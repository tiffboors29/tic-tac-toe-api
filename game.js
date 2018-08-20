const game = {

	checkRows: board => {
		let rowOne = board[0] === board[1] && board[1] === board[2] ? board[2] : false,
				rowTwo = board[3] === board[4] && board[4] === board[5] ? board[5] : false,
				rowThree = board[6] === board[7] && board[7] === board[8] ? board[8] : false;
	  
	  return rowOne || rowTwo || rowThree;
	},

	checkCols: board => {
		let colOne = board[0] === board[3] && board[3] === board[6] ? board[6] : false,
      	colTwo = board[1] === board[4] && board[4] === board[7] ? board[7] : false,
      	colThree = board[2] === board[5] && board[5] === board[8] ? board[8] : false;

     return colOne || colTwo || colThree;
	},

	checkDiagonal: board => {
		let backSlash = board[0] === board[4] && board[4] === board[8] ? board[8] : false,
      	forwardSlash = board[2] === board[4] && board[4] === board[6] ? board[6] : false;

     return backSlash || forwardSlash;
	},

	checkWinner: board => {
		let winner = game.checkRows(board) || game.checkCols(board) || game.checkDiagonal(board);
		winner = winner === 'x' ? 'x' : winner === 'o' ? 'o' : false;
		return winner || (game.getAvailableMoves(board).length === 9 ? 'tie' : false);
	},

	getAvailableMoves: board => {
		let moves = [];
		board.forEach(( cell, i ) => {
			if ( cell === ' ' ) moves.push(i);
		});
		return moves;
	},

	minimax: ( newBoard, player ) => {
		let availSpots = game.getAvailableMoves(newBoard),
				winner = game.checkWinner(newBoard);

		if ( winner === 'x' ) return { score: -10 };
		else if ( winner === 'o' ) return { score: 10 };
		else if ( availSpots.length === 0 ) return { score: 0 };

		let moves = [], bestMove, bestScore;
		for ( let i = 0; i < availSpots.length; i++ ) {
			let move = {}, result;
			move.index = availSpots[i];
			newBoard[availSpots[i]] = player;

			if (player == 'o') {
				result = game.minimax(newBoard, 'x');
				move.score = result.score;
			} 
			else {
				result = game.minimax(newBoard, 'o');
				move.score = result.score;
			}

			newBoard[availSpots[i]] = move.index;
			moves.push(move);
		}

		if( player === 'o' ) {
			bestScore = -10000;
			
			for ( let i = 0; i < moves.length; i++ ) {
				if ( moves[i].score > bestScore ) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} 
		else {
			bestScore = 10000;
			for ( let i = 0; i < moves.length; i++ ) {
				if ( moves[i].score < bestScore ) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}

		return moves[bestMove];
	},

	takeTurn: board => {
		let move = game.minimax(board.slice(), 'o').index;
		board[move] = 'o';
		return board;
	},

	isOTurn: board => {
		let o = board.filter(x => x === 'o').length,
				x = board.filter(x => x === 'x').length;
		return game.checkWinner(board) ? false : o === x || x > o;
	},

	isBoardValid: board => {
		if (board.length === 9){
			let o = board.filter(x => x === 'o').length,
					x = board.filter(x => x === 'x').length,
					space = board.filter(x => x === ' ').length;
			return o + x + space === 9 && (o === x ? true : (o + 1 === x || x + 1 === o));
		}
		return false;
	}

};

module.exports = game;