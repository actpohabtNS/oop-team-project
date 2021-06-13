import React from 'react'
import { Line } from 'react-konva'
import colors from '../styles/colors';
import dimensions from '../styles/dimensions';
import durations from '../styles/durations';

class Link extends React.Component {
  constructor(props) {
    super(props);

    this.link = React.createRef();
  }

  componentDidMount() {
    const { start, end } = this.props;

    this.link.current.setAttrs({
      points: [ start.x, start.y, start.x, start.y ]
    })

    this.link.current.to({
      points: [start.x, start.y, end.x, end.y],
      duration: durations.lineDraw
    });

    setTimeout(() => {
      this.link.current.setAttrs({
        points: [ start.x, start.y, end.x, end.y ]
      })
    }, durations.lineDraw * 1000);
  }

  render() {
    return (
      <Line
        ref={this.link}
        stroke={colors.line}
        strokeWidth={dimensions.lineStroke}
        lineCap='round'
        lineJoin='round'
      />
    )
  }
}
export default Link;