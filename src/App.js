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
  }

  handleStageClick(e) {
    let {x, y} = e.currentTarget.getPointerPosition();
    this.setState({ points: [ {x, y}, ...this.state.points ] });
  };

  render() {
    return (
      <Container fluid className="p-0 app d-flex flex-column">
          <Stage
            width={window.innerWidth}
            height={window.innerHeight * 0.88}
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
          <Button variant="outline-secondary" disabled>
            {'✕ Clear ✕'}
          </Button>
          <Button variant="primary" disabled>
            {'> Next step >'}
          </Button>
  
          <Button variant="primary" disabled>
            {'⏵ Animate ⏵'}
          </Button>
  
          <Button variant="primary" disabled>
            {'>> Result >>'}
          </Button>
  
          <Button variant="outline-primary">
            {'⇋ Randomize ⇋'}
          </Button>
        </footer>
      </Container>
    );
  }
}

export default App;
