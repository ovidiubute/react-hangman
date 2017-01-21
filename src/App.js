import React, { Component } from 'react';
import uuid from 'node-uuid';

import randomWord from './random-word';
import AttemptsLeft from './AttemptsLeft';
import Letter from './Letter';
import Word from './Word';
import VirtualKeyboard from './VirtualKeyboard';
import hangmanAttempts from './HangmanAttempts';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.onLetterClick = this.onLetterClick.bind(this)

    const gameWord = randomWord();
    this.state = {
      word: gameWord,
      letters: gameWord.split('').map(letter => ({
        value: letter,
        guessed: false,
      })),
      guesses: 5,
      gameState: 'BEGIN',
      pastGuesses: [],
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Hangman</h2>
        </div>
        {this._renderGame()}
        {this._renderFooter()}
      </div>
    );
  }

  _renderGame() {
    return this.state.gameState === 'BEGIN'
      ? (
        <div className="App-content">
          {this._renderNewGame()}
        </div>
      )
      : (
        <div className="App-content">
          {this._renderGameOver()}
        </div>
      );
  }

  _renderFooter() {
    return (
      <div className="App-footer">
        <h5>Made with <span style={{color: 'red'}}>&#9829;</span> by <a
            target="_blank"
            href="https://twitter.com/ovidiubute">Ovidiu
          </a> using React and create-react-app boilerplate &#169; 2017
        </h5>
      </div>
    );
  }

  _renderNewGame() {
    return (
      <div className="App-SideBySide">
        <div className="App-InputPanel">
          {this._renderWord()}
          <div className="App-AttemptsLeft">
            <AttemptsLeft attempts={this.state.guesses} />
          </div>
          <div className="App-VirtualKeyboard">
            <VirtualKeyboard
              excluded={this.state.pastGuesses}
              onClick={this.onLetterClick}
            />
          </div>
        </div>
        <div className="App-Hangman">
          {hangmanAttempts(this.state.guesses)}
        </div>
      </div>
    );
  }

  _renderGameOver() {
    return (
      <div className="App-GameOver">
        <span>GAME OVER</span>
      </div>
    );
  }

  _renderWord() {
    return (
      <div className="App-Word">
        <Word>
          {this.state.letters.map(letter => {
            return (
              <Letter key={uuid()} value={letter.guessed ? letter.value : '_'}
              />
            );
          })}
        </Word>
      </div>
    );
  }

  onLetterClick(letter, e) {
    e.preventDefault();

    const firstIndex = this.state.word.indexOf(letter)
    if (firstIndex !== -1) {
      const letters = this.state.letters.map(letterObject => {
        if (letterObject.value === letter) {
          return Object.assign({}, letterObject, {
            guessed: true,
          });
        }

        return letterObject;
      });

      this.setState({
        letters,
      });
    } else {
      this.setState((prevState, props) => {
        // Update number of attempts left
        const guessesLeft = prevState.guesses - 1;
        let stateUpdate = {
          guesses: guessesLeft,
        };

        // Kill the game if needed
        if (guessesLeft === 0) {
          stateUpdate.gameState = 'OVER';
        }

        // Update the letters already tried
        stateUpdate.pastGuesses = [letter].concat(prevState.pastGuesses);

        return stateUpdate;
      });
    }
  }
}

export default App;
