import './App.css';
import React from 'react';

const generateDataset = () => (
  Array(30).fill(0).map(() => ([
    Math.random() * 80 + 10,
    Math.random() * 35 + 10,
    "blue",
  ]))
)

class Circles extends React.Component {
  constructor() {
    super();
    this.width = 100;
    this.height = 50;
    this.state = {dataset: generateDataset()};
  }

  setColor(i) {
    let dataset = this.state.dataset;
    dataset[i][2] = "red";
    this.setState({dataset: dataset});
  }

  render() {
    let width = this.width;
    let height = this.height;;
    return (
      <svg viewBox="0 0 100 50" style={{border: '3px solid black', margin: '5px'}}>
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="black" strokeWidth="0.1" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="black" strokeWidth="0.1" />
        {this.state.dataset.map(([x, y, color], i) => (
          <circle
            cx={x}
            cy={y}
            key={i}
            r="1"
            fill={color}
            onClick={() => this.setColor(i)}
          />
        ))}
      </svg>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Circles></Circles>
    </div>
  );
}

export default App;
