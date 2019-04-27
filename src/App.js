import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Typo from "typo-js";

//var Typo = require("typo-js");
/*
	var Typo = function(){

		this.check = function(){
			return true;
		}
	}
	*/
var dictionary = new Typo("en_US", null, null, {
  dictionaryPath: "./dictionaries"
});

console.log(dictionary.check("dog"));
var gameTime = 120;
var posArr = [
  "11",
  "21",
  "31",
  "41",
  "12",
  "22",
  "32",
  "42",
  "13",
  "23",
  "33",
  "43",
  "14",
  "24",
  "34",
  "44"
];

function Square(props) {
  return (
    <div className={props.className} onClick={props.onClick}>
      {props.curVal}
    </div>
  );
}

function TextDisplay(props) {
  return <div className="dispText">{props.value}</div>;
}

function GameTitle(props) {
  return <div className="gameTitle">SCRAMBLORDS</div>;
}

function GameInfo(props) {
  return <div className="" />;
}

function WordList(props) {
  const words = props.words;

  const numbers = props.numbers;
  const listItems = words.map(word => (
    // Correct! Key should be specified inside the array.
    <ListItem key={word.toString()} value={word} />
  ));
  return <div className="wordBox">{listItems}</div>;
}

function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return (
    <span>
      {props.value}
      <br />
    </span>
  );
}

function ScoreBox(props) {
  return (
    <div className={props.className}>
      <div className="scoreBoxLabel">
        {" "}
        Score <span> {props.score} </span>{" "}
      </div>
    </div>
  );
}

function CheckButton(props) {
  return (
    <button className="checkButton" onClick={props.onClick}>
      Check
    </button>
  );
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curTime: props.startTime
    };
  }

  componentDidMount() {
    this.startTimer();
  }
  startTimer() {
    this.timer = setInterval(this.tickee, 1000);
  }

  tickee = () => {
    const newTime = this.state.curTime - 1;

    if (newTime < 1) {
      console.log("Timer has stopped!");
      clearInterval(this.timer);
      this.setState({
        curTime: 0
      });
    } else {
      this.setState({
        curTime: newTime
      });
    }
  };

  render() {
    return (
      <div className="timer">
        <div className="timerLabel">
          {" "}
          Time <span>{this.state.curTime} </span>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      curChar: "X",
      charList: this.generateNewChars(),
      curWord: "",
      words: [],
      score: 0,
      textBoxClass: "",
      squareClass: "square",
      lastClicked: -1,
      clickedArr: [],
      neighbors: [],
      clickStateArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }

  generateNewChars() {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const charlist = Array(16).fill(null);

    for (let i = 0; i < charlist.length; i++) {
      charlist[i] = newRandomChar();
    }
    return charlist;
  }

  handleClick(i) {
    const clickedLetter = this.state.charList[i];
    let arr = this.state.clickedArr;
    let isNeighbor = false;
    const neighbors = this.state.neighbors;
    let clickArr = this.state.clickStateArr;
    //Check if square has not been clicked before
    if (arr.indexOf(i) > -1) {
      console.log("button has been clicked");
      if (this.state.lastClicked == i) {
        this.checkClick();
      } else {
        this.resetClickParams();
      }
    } else {
      //Check if button is neighbor

      if (this.state.lastClicked == -1) {
        //If this is first click no need to check neighbor
        isNeighbor = true;
      } else {
        if (neighbors.indexOf(i) > -1) {
          isNeighbor = true;
        }
      }

      if (isNeighbor) {
        arr.push(i);
        console.log(this.state.charList[i]);
        const word = this.state.curWord + clickedLetter;
        clickArr[i] = 1;
        this.setState({
          curChar: "B",
          curWord: word,
          lastClicked: i,
          squareClass: "squareHit",
          clickStateArr: clickArr
        });
        this.setNeighbor(i);
      } else {
        console.log("not a neighbor");
        this.resetClickParams();
      }
    }
  }

  resetClickParams() {
    this.setState({
      neighbors: [],
      lastClicked: -1,
      clickedArr: [],
      curWord: "",
      curChar: "",
      squareClass: "square",
      clickStateArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    });
  }

  setNeighbor(_num) {
    //5431

    //var mv:MovieClip = objArr[_num - 1] as MovieClip;
    var neighborArr = [];

    var xpos = posArr[_num].substr(0, 1);
    var ypos = posArr[_num].substr(1, 1);

    var tmArr = [-1, 1, -3, 3, -4, 4, -5, 5];

    if (xpos == 1) {
      // LEFT
      tmArr[0] = 0;
      tmArr[3] = 0;
      tmArr[6] = 0;
    }

    if (xpos == 4) {
      //RIGHT
      tmArr[1] = 0;
      tmArr[2] = 0;
      tmArr[7] = 0;
    }

    if (ypos == 1) {
      //TOP
      tmArr[2] = 0;
      tmArr[4] = 0;
      tmArr[6] = 0;
    }

    if (ypos == 4) {
      //DOWN
      tmArr[5] = 0;
      tmArr[3] = 0;
      tmArr[7] = 0;
    }

    console.log(tmArr);
    for (var j = 0; j < 8; j++) {
      var pval = tmArr[j];
      if (pval != 0) {
        neighborArr.push(_num + pval);
      }
    }
    console.log(neighborArr);
    this.setState({
      neighbors: neighborArr
    });
  }

  checkClick() {
    let isCorrect = dictionary.check(this.state.curWord);
    console.log(this.state.curWord);
    let arr = this.state.words;
    let score = this.state.score;
    //Check if entered text is 3 chars or more
    if (this.state.curWord.length > 2) {
      if (isCorrect) {
        //Check if spelling is corret

        //Check if word is not found yet
        if (arr.indexOf(this.state.curWord) == -1) {
          arr.push(this.state.curWord);
          score = score + 50 + 10 * this.state.curWord.length;
          this.setState({
            words: arr,
            score: score,
            textBoxClass: "dispTextGreen"
          });
        } else {
          //Word has been found already
          console.log("Word exists");
        }
      } else {
        //alert("Bano");
        console.log("no words");
      }
    } else {
      console.log("less than 3");
    }

    this.setState({
      curWord: ""
    });

    this.resetClickParams();
  }

  render() {
    return (
      <div className="gameContainer">
        <GameTitle />
        <div className="gameInfo">
          <div>
            <Timer startTime={gameTime} />
            <ScoreBox
              score={this.state.score}
              className={this.state.textBoxClass}
            />
          </div>
          <div className="wordListDiv">
            {" "}
            <WordList words={this.state.words} />
          </div>
          <div className="displayTextDiv">
            {" "}
            <TextDisplay value={this.state.curWord} />
          </div>
        </div>

        <Board
          charlist={this.state.charList}
          clickArr={this.state.clickStateArr}
          onClick={i => this.handleClick(i)}
        />
        <CheckButton onClick={() => this.checkClick()} />
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSquare(i) {
    const arr = this.props.clickArr;
    //	arr = this.props.clickArr;
    if (arr[i] == 0) {
      return (
        <Square
          curVal={this.props.charlist[i]}
          className="square"
          onClick={() => this.props.onClick(i)}
        />
      );
    } else {
      return (
        <Square
          curVal={this.props.charlist[i]}
          className="square hit"
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  }

  render() {
    return (
      <div className="main-board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
        <div className="board-row">
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
        </div>
      </div>
    );
  }
}

function newRandomChar() {
  const alphabetList = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y"
  ];
  const vowelLIST1 = ["E", "A", "I"];
  const vowelLIST2 = ["O", "U"];
  const specCharList = ["X", "Z", "Qu", "J"];

  var pChar = "";
  var rnd = parseInt(Math.random() * 100);
  var rnd2 = parseInt(Math.random() * 100);
  var num = 0;

  //Check if prog chooses vowel or consonant

  if (rnd < 8) {
    //VOWEL1
    pChar = "E";
  } else if (rnd > 7 && rnd < 13) {
    num = parseInt(Math.random() * 2);
    pChar = vowelLIST1[num];
  } else if (rnd > 12 && rnd < 21) {
    //VOWEL2
    num = parseInt(Math.random() * 1);
    pChar = vowelLIST2[num];
  } else if (rnd > 21 && rnd < 40) {
    // Common Consonants
    var commonConsList = ["N", "R", "D", "T"];
    num = parseInt(Math.random() * 4);
    pChar = commonConsList[num];
  } else if (rnd > 39 && rnd < 99) {
    //Consonant
    num = parseInt(Math.random() * 24);
    pChar = alphabetList[num];
  } else if (rnd == 99) {
    // Z
    pChar = "Z";
  } else if (rnd == 100) {
    // Qu
    pChar = "Qu";
  } else {
    pChar = "E";
  }

  return pChar;
}

class App extends Component {
  render() {
    return <Game />;
  }
}

export default App;
