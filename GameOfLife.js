/**
 * @flow
 */

import React, { Component } from 'react';
import { easeQuadInOut } from 'd3-ease';
import { scaleLinear } from 'd3-scale';
import { timer } from 'd3-timer';
import { interpolateNumber } from 'd3-interpolate';
import { Svg, G, Circle, Ellipse } from 'react-native-svg';

// Start by building our model
const fieldWidth = 25,
  fieldHeight = 25,

  // Define our visual space
  pxWidth = 380,
  pxHeight = 380,
  pxWidthSquare = pxWidth / fieldWidth,
  pxHeightSquare = pxHeight / fieldHeight,

  // How fast does it go?
  msTimestep = 1500,

  pxWidthOffset = pxWidthSquare/2,
  pxHeightOffset = pxHeightSquare/2,

  duration = 750;

const scaleX = scaleLinear()
	.domain([0, fieldWidth])
	.range([0, pxWidth]);

const scaleY = scaleLinear()
	.domain([0, fieldHeight])
	.range([0, pxHeight]);

// Create the initial field of cells
function randomField(): LifeStates {
  const widths = new Array(fieldWidth).fill();
  const heights = new Array(fieldHeight).fill();
  return widths.map(() => heights.map(() => Math.random() < 0.5 ? 1 : 0));
}

// Build the next generation of cells from the current generation of cells
function createNewGeneration(states): LifeStates {
  const nextGen = new Array()
	const ccx = states.length;

  for (let a = 0; a < ccx; a++) {
    const ccy = states[a].length;
    nextGen[a] = new Array()

    for (let b = 0; b < ccy; b++) {
      const ti = b - 1 < 0 ? ccy - 1 : b - 1 // top index
      const ri = a + 1 == ccx ? 0 : a + 1 // right index
      const bi = b + 1 == ccy ? 0 : b + 1 // bottom index
      const li = a - 1 < 0 ? ccx - 1 : a - 1 // left index

      let liveNeighbours = 0
      liveNeighbours += states[li][ti] ? 1 : 0
      liveNeighbours += states[a][ti] ? 1 : 0
      liveNeighbours += states[ri][ti] ? 1 : 0
      liveNeighbours += states[li][b] ? 1 : 0
      liveNeighbours += states[ri][b] ? 1 : 0
      liveNeighbours += states[li][bi] ? 1 : 0
      liveNeighbours += states[a][bi] ? 1 : 0
      liveNeighbours += states[ri][bi] ? 1 : 0

      nextGen[a][b] = states[a][b]
        ? (liveNeighbours == 2 || liveNeighbours == 3 ? 1 : 0)
        : (liveNeighbours == 3 ? 1 : 0);
    }
  }

  return nextGen
}

type Life = 0 | 1;

type LifeStates = Life[][];

type State = {
  field: LifeStates,
};

export default class GameOfLife extends Component<*, *, State> {
  state: State = {
    field: randomField(),
  };

  componentDidMount() {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.update(), msTimestep);
  }

  update() {
    this.setState({ field: createNewGeneration(this.state.field) });
  }

  render() {
    const { field } = this.state;
    // debugger;
    return (
      <Svg
        style={{
          backgroundColor: '#212121',
          borderRadius: 5,
          padding: 10,
        }}
        width={pxWidth}
        height={pxHeight}
        onClick={() => { debugger; }}
      >
        <G>
          {field.map((row, i) => row.map((cell, j) =>
            <Cell
              x={scaleX(i)}
              y={scaleY(j)}
              rx={pxWidthOffset}
              ry={pxHeightOffset}
              alive={cell}
              key={`${i},${j}`}
            />
          ))}
        </G>
      </Svg>
    );
  }
}

type CellProps = {
  x: number,
  y: number,
  cx: number,
  cy: number,
  alive: boolean,
}

type CellState = {
  fill: string,
}

class Cell extends Component<*, CellProps, CellState> {
  state: CellState = {
    fill: 'rgba(0, 0, 0, 0)',
  };

  componentDidMount() {
    if (this.props.alive) {
      this.entering(this.props);
    }
  }

  componentWillReceiveProps(next: CellProps) {
    if (this.props.alive === next.alive) return;
    if (next.alive) {
      this.entering(this.props);
    } else {
      this.exiting(this.props);
    }
  }

  entering(props, refs) {
    const interp = interpolateNumber(1e-6, 1);
    this.transition = timer(elapsed => {
      const percentDone = elapsed < duration ? (elapsed / duration) : 1;
      if (percentDone !== 1) {
        const opacity = easeQuadInOut(interp(percentDone));
        this.setState({ fill: `rgba(33, 140, 33, ${opacity})` });
      } else {
        this.transition.stop();
        this.setState({ fill: `rgba(254, 254, 254, 1)` });
      }
    });
  }

  exiting(props, refs) {
    const interp = interpolateNumber(1, 0);
    this.transition = timer(elapsed => {
      const percentDone = elapsed < duration ? (elapsed / duration) : 1;
      if (percentDone !== 1) {
        const opacity = easeQuadInOut(interp(percentDone));
        this.setState({ fill: `rgba(140, 33, 33, ${opacity})` });
      } else {
        this.transition.stop();
        this.setState({ fill: `rgba(254, 254, 254, 0)` })
      }
    });
  }

  render() {
    const { x, y, rx, ry }: CellProps = this.props;
    const { fill } = this.state;
    return rx === ry
      ? <Circle fill={fill} cx={x + rx} cy={y + rx} r={rx} />
      : <Ellipse fill={fill} cx={x + rx} cy={y + ry} rx={rx} ry={ry}/>
  }
}
