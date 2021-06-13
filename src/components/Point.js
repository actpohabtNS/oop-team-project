import React from 'react';
import { Circle } from 'react-konva'

import colors from '../styles/colors';
import dimensions from '../styles/dimensions';

class Point extends React.Component {
  constructor(props) {
    super(props);

    this.point = React.createRef();
  }

  changeSize(to) {
    this.point.current.to({
      scaleX: to,
      scaleY: to,
      duration: 0.2
    });
  }

  componentDidMount() {
    this.changeSize(dimensions.pointRadius);
  }

  // optimization
  shouldComponentUpdate() {
    return false;
  }

  render() {
    let { x, y } = this.props;

    return (
      <Circle
        ref={this.point}
        x={x}
        y={y}
        radius={1}
        fill={colors.point}
      />
    );
  }
}

export default Point;