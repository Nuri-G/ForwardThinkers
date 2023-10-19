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
        this.state = {data: null, xAxis: "Gls", yAxis: "Ast", xMin: 0, xMax: 20, yMin: 0, yMax: 20}
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
                processedData.push(processedLine);
            }

            this.setState({...this.state, data: processedData});
        })
    }

    setColor(i) {
        let dataset = this.state.data;
        dataset[i][2] = "red";
        this.setState(dataset);
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
                let color = "blue";
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
                    {this.renderXAxis()}
                    {this.renderYAxis()}
                </svg>
            </div>
            
        ); 
    }


    renderXAxis() {
        const desiredTickCount = 20; // Set your desired number of tick marks
        const xAxisLabels = this.state.data ? Object.keys(this.state.data[0]['Performance']) : [];
        const xRange = this.state.xMax - this.state.xMin;
        const tickCount = Math.min(desiredTickCount, xAxisLabels.length); // Ensure you don't exceed the available data points
    
        return (
            <g>
                <line x1={0} y1={this.height / 2} x2={this.width} y2={this.height / 2} stroke="black" strokeWidth="0.5" />
                {xAxisLabels.map((label, i) => {
                    if (i % (xAxisLabels.length / tickCount) === 0) { // Control the number of tick marks
                        const x = (i / (xAxisLabels.length - 1)) * this.width;
                        const value = this.state.xMin + (i / (xAxisLabels.length - 1)) * xRange;
                        return (
                            <g key={i}>
                                <line x1={x} y1={this.height / 2 - 3} x2={x} y2={this.height / 2 + 3} stroke="black" strokeWidth="0.5" />
                                <text x={x} y={this.height / 2 + 10} fontSize="3" textAnchor="middle">{value.toFixed(1)}</text>
                            </g>
                        );
                    }
                    return null; // Hide the labels and tick marks that are not part of the selected tickCount
                })}
            </g>
        );
    }
    

    renderYAxis() {
        const tickCount = 5; // You can adjust this based on your requirements
        const yAxisLabels = this.state.data ? Object.keys(this.state.data[0]['Performance']) : [];
        const yRange = this.state.yMax - this.state.yMin;
    
        return (
            <g>
                <line x1={this.width / 2} y1={0} x2={this.width / 2} y2={this.height} stroke="black" strokeWidth="0.25" />
                {yAxisLabels.map((label, i) => {
                    const y = (i / (yAxisLabels.length - 1)) * this.height;
                    const value = this.state.yMin + (i / (yAxisLabels.length - 1)) * yRange;
                    return (
                        <g key={i}>
                            <line x1={this.width / 2 - 1} y1={y} x2={this.width / 2 + 1} y2={y} stroke="black" strokeWidth="0.25" />
                            <text x={this.width / 2 - 1} y={y + 3} fontSize="1" textAnchor="end">{value.toFixed(1)}</text>
                        </g>
                    );
                })}
            </g>
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