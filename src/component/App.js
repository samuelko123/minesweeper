import { Grid, Box } from '@material-ui/core';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import html2canvas from 'html2canvas';
import React from 'react';
import Board from './Board';
import Counter from './Counter';
import Button from './Button';
import Dropdown from './Dropdown';
import NumberInput from './NumberInput';
import './App.css';
const constants = require('../lib/constants');
const sprite = require('../sprite.png');

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.restart_count = 0;  // Note: change this will force restasrt
    this.screenshot = '';

    this.settings = {
      board_width: 30,
      board_height: 16,
      bomb_count: 99,
      mode: constants.MODE_HARD
    };

    this.state = {
      button_status: constants.BUTTON_INIT,
      time: 0,
      win: false,
      flag_count: 0
    };
  }

  downloadScreenshot = () => {
    html2canvas(document.getElementById('board'), {
      scrollX: 0,
      scrollY: -window.scrollY
    }).then(function (canvas) {
      let a = document.createElement('a');
      a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      a.download = 'MineSweeper.png';
      a.click();
    });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === constants.KEYBOARD_F2)
      this.restartGame();
  }

  handleSmileyClick = () => {
    this.restartGame();
  }

  restartGame = () => {
    // Force a restart
    clearInterval(this.timer);
    this.restart_count++;

    this.setState({
      button_status: constants.BUTTON_INIT,
      time: 0,
      flag_count: 0,
      win: false
    });
  }

  handleTilePeek = (peek) => {
    let status = peek ? constants.BUTTON_PEEK : constants.BUTTON_INIT;
    this.setState({ button_status: status });
  }

  handleGameStatus = (status) => {
    switch (status) {
      case constants.GAME_STATUS_START:
        this.timer = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000);
        this.setState({ win: false });
        break;
      case constants.GAME_STATUS_WIN:
        clearInterval(this.timer);
        this.setState({ win: true });
        break;
      case constants.GAME_STATUS_LOSE:
        clearInterval(this.timer);
        break;
      default:
    }

    this.setState({ button_status: status });
  }

  handleFlagChange = (flagged) => {
    flagged ?
      this.setState({ flag_count: this.state.flag_count + 1 }) :
      this.setState({ flag_count: this.state.flag_count - 1 });
  }

  handleDropdownChange = (mode) => {
    let width, height, bombs;

    switch (mode) {
      case constants.MODE_EASY:
        width = 9; height = 9; bombs = 10;
        break;
      case constants.MODE_MEDIUM:
        width = 16; height = 16; bombs = 40;
        break;
      case constants.MODE_HARD:
        width = 30; height = 16; bombs = 99;
        break;
      default: // Do Nothing
    }

    this.settings = {
      board_width: width,
      board_height: height,
      bomb_count: bombs,
      mode: mode
    };

    this.restartGame();
  }

  handleNumberInputChange = (obj) => {
    let key = Object.keys(obj)[0];
    this.settings[key] = obj[key];
    this.settings.bomb_count = Math.min(this.settings.bomb_count, this.settings.board_width * this.settings.board_height - 1);
    this.settings.mode = constants.MODE_CUSTOM;
    this.restartGame();
  }

  render() {
    let screenshot_button =
      <div className="tooltip">
        <i onClick={this.downloadScreenshot} className="fa fa-camera pointer"></i>
        <span className="tooltiptext">Download screenshot</span>
      </div>;

    let win_msg = this.state.win ?
      <div>
        <div>
          <span>Share your victory on : </span>
          <FacebookShareButton
            children={sprite}
            url="https://mine-sweeper.now.sh/"
            quote={"I beat Minesweeper (" + constants.MODES[this.settings.mode] + ": " + this.settings.board_width + "x" + this.settings.board_height + ", " + this.settings.bomb_count + " bombs) in " + this.state.time + " seconds! "}
          ><FacebookIcon size={20} round></FacebookIcon></FacebookShareButton>
        </div>
        <div>
          <span>Download screenshot: </span>{screenshot_button}
        </div>
      </div>
      : null;


    return (
      <div
        id='app'
        className='noselect'
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
      >
        <h1 className='hide'>MineSweeper</h1>
        <h2 className='hide'>MineSweeper made from ReactJS</h2>
        <h3 className='hide'>Enjoy the classic MineSweeper</h3>
        <h4 className='hide'>Contact developer: koshunyin@gmail.com</h4>

        <Box mb={1}>
          <Grid
            container={true}
            direction='row'
            justify='flex-start'
            alignItems='flex-end'
          >
            <Box ml={1}>
              <Dropdown
                key={this.restart_count}
                mode={this.settings.mode}
                notifyChange={this.handleDropdownChange}
              ></Dropdown>
            </Box>

            <Box ml={1}>
              <NumberInput
                key={this.restart_count}
                name='Width'
                value={this.settings.board_width}
                min={constants.BOARD_WIDTH_MIN}
                max={constants.BOARD_WIDTH_MAX}
                notifyChange={(val) => { this.handleNumberInputChange({ board_width: val }) }}
              ></NumberInput>
            </Box>

            <Box ml={1}>
              <NumberInput
                key={this.restart_count}
                name='Height'
                value={this.settings.board_height}
                min={constants.BOARD_HEIGHT_MIN}
                max={constants.BOARD_HEIGHT_MAX}
                notifyChange={(val) => { this.handleNumberInputChange({ board_height: val }) }}
              ></NumberInput>
            </Box>

            <Box ml={1}>
              <NumberInput
                key={this.restart_count}
                name='Bombs'
                value={this.settings.bomb_count}
                min={1}
                max={this.settings.board_width * this.settings.board_height - 1} // Allow one non-bomb tile
                notifyChange={(val) => { this.handleNumberInputChange({ bomb_count: val }) }}
              ></NumberInput>
            </Box>
          </Grid>
        </Box>

        {win_msg}

        <div
          style={{ width: this.settings.board_width * constants.TILE_HEIGHT }}
          onContextMenu={(e) => { e.preventDefault() }}
        >
          <div id='board'>
            <div id='header'>
              <Counter value={this.settings.bomb_count - this.state.flag_count} />
              <div>
                <Button
                  notifyClick={this.handleSmileyClick}
                  status={this.state.button_status}
                ></Button>
              </div>
              <Counter value={this.state.time} />
            </div>

            <Board
              key={this.restart_count}
              board_width={this.settings.board_width}
              board_height={this.settings.board_height}
              bomb_count={this.settings.bomb_count}
              notifyFlagChange={this.handleFlagChange}
              notifyGameStatus={this.handleGameStatus}
              notifyTilePeek={this.handleTilePeek}
            />
          </div>

          <footer>
            <div>
              <span>Samuel Ko | </span>
              <div className="tooltip">
                <a href="mailto:koshunyin@gmail.com">
                  <i className="fa fa-envelope"></i>
                </a>
                <span className="tooltiptext">Email me</span>
              </div>
              <span> | </span>
              <div className="tooltip">
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/samuelko123/minesweeper">
                  <i className="fa fa-github"></i>
                </a>
                <span className="tooltiptext">See source code</span>
              </div>
              <span> | </span>
              <div className="tooltip">
                <i onClick={this.downloadScreenshot} className="fa fa-camera pointer"></i>
                <span className="tooltiptext">Download screenshot</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

    );
  }
}
