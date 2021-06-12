import React from 'react';
import { Container, Button } from 'react-bootstrap'
import { Stage, Layer, Circle, Line } from 'react-konva';

import './styles/App.css';
import colors from './styles/colors';
import dimensions from './styles/dimensions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      points: [],
      lines: []
    }

    this.handleStageClick = this.handleStageClick.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleNextStepClick = this.handleNextStepClick.bind(this);
    this.handleAnimateClick = this.handleAnimateClick.bind(this);
    this.handleResultClick = this.handleResultClick.bind(this);
    this.handleRandomizeClick = this.handleRandomizeClick.bind(this);
  }

  handleStageClick(e) {
    let {x, y} = e.currentTarget.getPointerPosition();
    this.setState({ points: [ {x, y}, ...this.state.points ] });
  };

  handleClearClick() {
    this.setState({ points: [] });
  }

  handleNextStepClick() {
    // api.server.getIterator(this.state.points);
    console.log("Reaching for iterator for", this.state.points.length, "points to API.");
  }

  handleAnimateClick() {
    // api.server.getIterator(this.state.points);
    console.log("Sending", this.state.points.length, "points to API to animate.");
  }

  handleResultClick() {
    // api.server.getResult(this.state.points);
    console.log("Reaching for result for", this.state.points.length, "points to API.");
  }

  // TODO: decide whether to restict number of points of canvas or not
  handleRandomizeClick() {
    const randomPoint = (maxX, maxY) => {
      return {
        x: Math.random() * maxX,
        y: Math.random() * maxY
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
              <Line
                points={[555, 700, 140, 23, 250, 60, 300, 20]}
                stroke={colors.line}
                strokeWidth={dimensions.lineStroke}
                lineCap='round'
                lineJoin='round'
              />

              {
                //TODO: point appearing animation
                this.state.points.map((point, idx) => <Circle x={point.x} y={point.y} radius={dimensions.pointRadius} fill={colors.point} key={idx} />)
              }
            </Layer>
          </Stage>
  
        <footer className="toolbar d-flex justify-content-center align-items-center h-100">
          <Button variant="outline-secondary" disabled={!this.state.points.length} onClick={this.handleClearClick}>
            {'✕ Clear ✕'}
          </Button>
          <Button variant="primary" disabled={!readyToStart} onClick={this.handleNextStepClick}>
            {'> Next step >'}
          </Button>
  
          <Button variant="primary" disabled={!readyToStart} onClick={this.handleAnimateClick}>
            {'⏵ Animate ⏵'}
          </Button>
  
          <Button variant="primary" disabled={!readyToStart} onClick={this.handleResultClick}>
            {'>> Result >>'}
          </Button>
  
          <Button variant="outline-primary" onClick={this.handleRandomizeClick}>
            {'⇋ Randomize ⇋'}
          </Button>
        </footer>
      </Container>
    );
  }
}

export default App;
