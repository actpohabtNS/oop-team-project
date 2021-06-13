import React from 'react';
import { Container, Button } from 'react-bootstrap'
import { Stage, Layer } from 'react-konva';

import './styles/App.css';
import colors from './styles/colors';
import dimensions from './styles/dimensions';
import Point from './components/Point'
import Link from './components/Link'

import iterator from './api/iterator.json'
import durations from './styles/durations';
import { shallowCompare } from './utils/compare';

const initialState = {
  playing: false,
  playingInterval: null,
  points: [],
  lines: [],
  iterator: null,
  step: -1,
  done: false
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState
    }
  }

  closePoint = point => {
    return this.state.points.find(_point => Math.abs(point.x - _point.x) < dimensions.pointRadius*2 && Math.abs(point.y - _point.y) < dimensions.pointRadius*2);
  }

  TEMP_loadPoints = () => {
    this.setState({ points: [
      { x: 0, y: 400 }, { x: 100, y: 0 }, { x: 400, y: 400 }, { x: 500, y: 0 }
    ] })
  }

  pointIndex = point => {
    return this.state.points.findIndex(_point => shallowCompare(_point, point));
  }

  modifyLines = modifiedLine => {
    let lines = this.state.lines;
    const idx = lines.findIndex(_line => shallowCompare(_line.start, modifiedLine.start) && shallowCompare(_line.end, modifiedLine.end));
    if (~idx) {
      lines[idx] = modifiedLine;
      this.setState({ lines });
    } else {
      this.setState({ lines: [ modifiedLine, ...lines ] });
    }
  }

  loadStep = () => {
    if (this.state.step === this.state.iterator.steps.length) {
      clearInterval(this.state.playingInterval);
      this.setState({ playing: false, playingInterval: null, iterator: null, step: -1, done: true });
      return;
    }

    const step = this.state.iterator.steps[this.state.step];

    for (let link of step.lines) {
      const { startPoint, endPoint, isSolid } = link;
      this.modifyLines({ start: startPoint, end: endPoint, isSolid });
    }

    this.setState({ step: this.state.step + 1 });
  }

  handleStageClick = e => {
    let {x, y} = e.currentTarget.getPointerPosition();

    x = Math.round(x);
    y = Math.round(y);

    if (this.state.playing || this.state.step !== -1 || this.closePoint({x, y})) {
      return;
    }

    this.setState({ points: [ {x, y}, ...this.state.points ] });
  };

  handleClearClick = () => {
    this.setState({ ...initialState });
  }

  checkForIterator = () => {
    if (!this.state.iterator) {
      // api.server.getIterator(this.state.points);
      console.log("Dear server, give me Iterator for such data", JSON.stringify({"points": this.state.points}));
      this.TEMP_loadPoints();

      this.setState({ iterator, step: 0 });
    }
  }

  handleNextStepClick = () => {
    this.checkForIterator();

    // to prevent asynchronous state updates (when muptiple setState calls are batched into a single update)
    // more: https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous 
    setTimeout(this.loadStep);
  }

  handleAnimateClick = () => {
    this.checkForIterator();

    setTimeout(this.loadStep);
    const playingInterval = setInterval(this.loadStep, durations.stepAnimation * 1000);
    this.setState({ playing: true, playingInterval });
  }

  handleStopClick = () => {
    clearInterval(this.state.playingInterval);
    this.setState({ playing: false, playingInterval: null });
  }

  // TODO
  handleResultClick = () => {
    // api.server.getResult(this.state.points);
    console.log("Reaching for result for", this.state.points.length, "points to API.");
  }

  handleRandomizeClick = () => {
    const randomPoint = (maxX, maxY) => {
      return {
        x: Math.round(Math.random() * maxX),
        y: Math.round(Math.random() * maxY)
      }
    }

    let randomPoints = [];
    for (let i = 0; i < 10; i++) {
      randomPoints.push(
        randomPoint(
          window.innerWidth * dimensions.canvasWidthMultiplier,
          window.innerHeight * dimensions.canvasHeigthMultiplier)
        )
    }

    this.setState({ points: [ ...randomPoints, ...this.state.points ] });
  }

  render() {
    let readyToStart = this.state.points.length >= 3;

    return (
      <Container fluid className="p-0 app d-flex flex-column">
          <Stage
            width={window.innerWidth * dimensions.canvasWidthMultiplier}
            height={window.innerHeight * dimensions.canvasHeigthMultiplier}
            className="canvas m-4 mb-0 p-0"
            style={{ backgroundColor: colors.canvas }}
            onClick={this.handleStageClick}
          >
            <Layer>
                {
                  this.state.lines.map((line, idx) => <Link start={line.start} end={line.end} dashed={ !line.isSolid } key={`link-${line.start.x}-${line.start.y}-${line.end.x}-${line.end.y}`} />)
                }
            </Layer>

            <Layer>
              {
                this.state.points.map(point => <Point x={point.x} y={point.y} key={`point-${point.x}-${point.y}`} />)
              }
            </Layer>
          </Stage>
  
        <footer className="toolbar d-flex justify-content-center align-items-center h-100">
          <Button variant="outline-secondary" disabled={!this.state.points.length || this.state.playing} onClick={this.handleClearClick}>
            {'✕ Clear ✕'}
          </Button>
          <Button variant="primary" disabled={!readyToStart || this.state.playing || this.state.done} onClick={this.handleNextStepClick}>
            {'> Next step >'}
          </Button>
  
          {
            this.state.playing ?
            <Button variant="primary" onClick={this.handleStopClick}>
              {'⏹ Stop ⏹'}
            </Button>
            :
            <Button variant="primary" disabled={!readyToStart || this.state.done} onClick={this.handleAnimateClick}>
              {'⏵ Animate ⏵'}
            </Button>
          }
  
          <Button variant="primary" disabled={!readyToStart || this.state.playing || this.state.done} onClick={this.handleResultClick}>
            {'>> Result >>'}
          </Button>
  
          <Button variant="outline-primary" disabled={this.state.playing || this.state.done || this.state.step !== -1} onClick={this.handleRandomizeClick}>
            {'⇋ Randomize ⇋'}
          </Button>
        </footer>
      </Container>
    );
  }
}

export default App;
