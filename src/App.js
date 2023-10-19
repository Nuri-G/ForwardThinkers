import './App.css';
import React from 'react';
import Papa from "papaparse";

async function fetchFile(filename) {
    const response = await fetch(filename);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const text = await decoder.decode(result.value);
    return text;
}

class Circles extends React.Component {
    constructor() {
        super();
        this.width = 100;
        this.height = 50;
        this.loading = false;
        this.state = {data: null, xAxis: "Gls", yAxis: "Ast", xMin: 0, xMax: 10, yMin: 0, yMax: 10}
    }

    toPlotCoords(x, y) {
        let newX = ((x - this.state.xMin) / (this.state.xMax - this.state.xMin)) * this.width;
        let newY = ((y - this.state.yMin) / (this.state.yMax - this.state.yMin)) * this.height;
        return {
            'x': newX,
            'y': newY,
        }
    }

    loadDataset(filename) {
        fetchFile(filename).then(text => {
            let data = Papa.parse(text).data;
            let categories = data[0];
            data.shift();
            let subcategories = data[0];
            data.shift();

            let currentCategory = null;
            let currentSubcategory = null;
            let processedData = [];

            for(let line of data) {
                let processedLine = {};

                for(let i = 0; i < categories.length; i++) {
                    if(categories[i] !== '') {
                        currentCategory = categories[i];

                        if(processedLine[currentCategory] == null) {
                            processedLine[currentCategory] = {};
                        }
                    }
                    currentSubcategory = subcategories[i];

                    processedLine[currentCategory][currentSubcategory] = line[i];
                }
                processedLine.color = 'blue';
                processedData.push(processedLine);
            }

            this.setState({...this.state, data: processedData});
        })
    }

    setColor(i) {
        let dataset = this.state.data;
        dataset[i].color = "red";
        this.setState({...this.state, data: dataset});
    }

    createDropdown(axis) {
        if(this.state != null && this.state.data != null && this.state.data.length > 0) {
            let labels = Object.keys(this.state.data[0]['Performance']);
            return ( //So either this dropdown is for just the y-axis (since we could keep the x-axis as minutes played) or we have two dropdowns
                <select>
                    <option key="a" value={-1}>Select the X-Axis</option> 
                    {labels.map((option, i) => {
                        return (
                            <option key={i} value={i}>
                                {option}
                            </option>
                        )
                    })}
                </select>
            )
        }
    }

    

    createChart() {
        if(this.state != null && this.state.data != null) {
            return this.state.data.map((line, i) => {
                let performance = line['Performance'];
                let coords = this.toPlotCoords(performance.Gls, performance.Ast)
                console.log(coords);
                let x = coords.x;
                let y = coords.y;
                let color = line.color;
                return (
                <circle
                    cx={x}
                    cy={y}
                    key={i}
                    r=".5" //Maybe should tweak size of circles because of amount of them
                    fill={color}
                    onClick={() => this.setColor(i)}
                />
            )})
        }
    }

    render() {
        if(!this.loading) {
            this.loading = true;
            this.loadDataset("./data/2022-2023.csv");
        }
        
        let width = this.width;
        let height = this.height;
        return ( //This box might need to be bigger as well, or we just make circles smaller
            <div>
                {this.createDropdown("x")} 
                <svg viewBox="0 0 100 50" style={{border: '3px solid black', margin: '5px'}}>
                    <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="black" strokeWidth="0.1" />
                    <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="black" strokeWidth="0.1" />
                    {this.createChart()}
                </svg>
            </div>
            
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