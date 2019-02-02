import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
          {props.value}
    </button>
  );
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }

    renderBoard() {
      let board = [];
      for (let rowNum = 0; rowNum < 3; rowNum++) {
        let children = [];
        for (let colNum = 0; colNum < 3; colNum++) {
          let squareNum = rowNum*3 + colNum;
          children.push(this.renderSquare(squareNum));
        }
        board.push(<div className="board-row" key={rowNum}>{children}</div>);
      }
      return board;
    }

    render() {
      return (
        <div>
          {this.renderBoard()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          changedSquare: null
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          changedSquare: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0, 
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step, move) => {
        let row;
        let col;
        [col,row] = colRow(step.changedSquare);
        const rowColDesc = row === null ?
          '' :
          '(' + col + ', ' + row + ')';
        const fontWeight = (move  === this.state.stepNumber) ?
          'bold' : 'normal';
        const desc = move ?
          'Go to move #' + move + " on square " + rowColDesc :
          'Go to game start';
        return (
          <li key={move}>
            <button 
              style={{fontWeight: fontWeight}}
               onClick={() => this.jumpTo(move)} 
            >{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }


      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}            
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines= [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [2,5,8],
      [1,4,7],
      [0,4,8],
      [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function colRow(squareNum) {
    if (squareNum == null) {
      return [null, null];
    }
    return [squareNum % 3, Math.floor(squareNum/3)  ]
  }