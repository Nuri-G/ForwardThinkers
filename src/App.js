import './App.css';
import React from 'react';
import Papa from "papaparse";
import swal from 'sweetalert2'; // NEED TO npm install sweetalert2 ------------- IMPORTANT!!!!!!!

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
        this.state = { data: null, xAxis: "Gls", yAxis: "Gls", xMin: 0, xMax: 38, yMin: 0, yMax: 15 } // Updated
    }

    toPlotCoords(x, y) {
        let newX = ((x - this.state.xMin) / (this.state.xMax - this.state.xMin)) * this.width;
        let newY = 50 - ((y - this.state.yMin) / (this.state.yMax - this.state.yMin)) * this.height;
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

            for (let line of data) {
                let processedLine = {};

                for (let i = 0; i < categories.length; i++) {
                    if (categories[i] !== '') {
                        currentCategory = categories[i];

                        if (processedLine[currentCategory] == null) {
                            processedLine[currentCategory] = {};
                        }
                    }
                    currentSubcategory = subcategories[i];

                    processedLine[currentCategory][currentSubcategory] = line[i];
                }
                processedLine.color = 'blue';
                processedData.push(processedLine);
            }

            this.setState({ ...this.state, data: processedData }, () => {
                this.updateAxis('xAxis', 'Gls');
                this.updateAxis('yAxis', 'Gls');
            });
        })
    }

    setColor(i) {
        let dataset = this.state.data;
        dataset[i].color = "green";
        this.setState({ ...this.state, data: dataset });
    }

    updateAxis(axis, value) {
        let newState = this.state;
        let data = this.state.data.map(a => a['Performance'][value]);
        let min = Math.min.apply(0, data) - 0.5;
        let max = Math.max.apply(0, data) + 0.5;

        if(axis === 'xAxis') {
            newState.xMax = max;
            newState.xMin = min;
        } else if(axis === 'yAxis') {
            newState.yMax = max;
            newState.yMin = min;
        }

        newState[axis] = value;
        this.setState(newState);
    }

    createDropdown(axis) {
        if (this.state != null && this.state.data != null && this.state.data.length > 0) {
            let labels = Object.keys(this.state.data[0]['Performance']);
            return ( //So either this dropdown is for just the y-axis (since we could keep the x-axis as minutes played) or we have two dropdowns
                <select onChange={(e) => this.updateAxis(axis, e.target.value)}>
                    <optgroup label={'Select the ' + axis}>
                        {labels.map((option, i) => {
                            return (
                                <option key={i} value={option}>
                                    {option}
                                </option>
                            )
                        })}
                    </optgroup>
                </select>
            )
        }
    }



    createChart() {
        if (this.state != null && this.state.data != null) {
            return this.state.data.map((line, i) => {
                let performance = line['Performance'];
                let coords = this.toPlotCoords(performance[this.state.xAxis], performance[this.state.yAxis])
                let player = line['Player'];
                let x = coords.x;
                let y = coords.y;
                let color = line.color;

                const handleClick = () => {
                    swal.fire({title: player.Player, text: 'Team: ' + player.Squad + 
                        '\nGoals: ' + performance.Gls + '\nAssists: ' + performance.Ast,
                        imageUrl: "https://i.etsystatic.com/37424896/r/il/137c95/4157715738/il_fullxfull.4157715738_3xm5.jpg", 
                        imageHeight: 100
                    
                    }); //Make sure to npm install sweetalert2 for this to work ----------------
                    this.setColor(i);
                };

                return (
                    <circle
                        cx={x}
                        cy={y}
                        key={i}
                        r=".5" //Maybe should tweak size of circles because of the number of them
                        fill={color}
                        onClick={handleClick}
                    />
                );
            });
        }
    }


    render() {
        if (!this.loading) {
            this.loading = true;
            this.loadDataset("./data/2022-2023.csv");
        }

        let width = this.width;
        let height = this.height;
        return ( //This box might need to be bigger as well, or we just make circles smaller
            <div>
                {this.createDropdown("xAxis")}
                {this.createDropdown("yAxis")}
                <svg viewBox="0 0 100 50" style={{ border: '3px solid black', margin: '5px' }}>
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
        const data = this.state.data;
        const xAxisProperty = this.state.xAxis;
        const xValues = data ? data.map(line => parseFloat(line['Performance'][xAxisProperty])) : [];
        const xMax = Math.max(...xValues);
        const xMin = Math.min(...xValues);
        const tickCount = xMax - xMin + 1; // You can adjust this based on your requirements
        const xAverage = xValues.reduce((acc, val) => acc + val, 0) / xValues.length;

        return (
            <g>
                <line x1={0} y1={this.height / 2} x2={this.width} y2={this.height / 2} stroke="black" strokeWidth="0.1" />
                {Array.from({ length: tickCount }).map((_, i) => {
                    const value = xMin + i; // Calculate the tick value as a whole number
                    const { x } = this.toPlotCoords(value, 0); // Convert value to screen coordinates

                    if (i % 2 === 0) {
                        return (
                            <g key={i}>
                                <line x1={x} y1={this.height / 2 - 1} x2={x} y2={this.height / 2 + 1} stroke="black" strokeWidth="0.1" />
                                <text x={x} y={this.height / 2 + 3} fontSize="1" textAnchor="middle">{value}</text>
                            </g>
                        );
                    } else {
                        return (
                            <line x1={x} y1={this.height / 2 - 0.5} x2={x} y2={this.height / 2 + 0.5} stroke="black" strokeWidth="0.1" key={i} />
                        );
                    }
                })}
            </g>
        );

    }



    renderYAxis() {
        const data = this.state.data;
        const yAxisProperty = this.state.yAxis;
        const yValues = data ? data.map(line => parseFloat(line['Performance'][yAxisProperty])) : [];
        const yMax = Math.max(...yValues);
        const yMin = Math.min(...yValues);
        const tickCount = yMax - yMin + 1; // You can adjust this based on your requirements
        const yAverage = yValues.reduce((acc, val) => acc + val, 0) / yValues.length;

        return (
            <g>
                <line x1={this.width / 2} y1={0} x2={this.width / 2} y2={this.height} stroke="black" strokeWidth="0.1" />
                {Array.from({ length: tickCount }).map((_, i) => {
                    const value = yMin + i; // Calculate the tick value as a whole number
                    const { y } = this.toPlotCoords(0, value); // Convert value to screen coordinates

                    if (i % 2 === 0) {
                        return (
                            <g key={i}>
                                <line x1={this.width / 2 - 1} y1={y} x2={this.width / 2 + 1} y2={y} stroke="black" strokeWidth="0.1" />
                                <text x={this.width / 2 - 1.5} y={y + 0.5} fontSize="1" textAnchor="end">{value}</text>
                            </g>
                        );
                    } else {
                        return (
                            <line x1={this.width / 2 - 0.5} y1={y} x2={this.width / 2 + 0.5} y2={y} stroke="black" strokeWidth="0.1" key={i} />
                        );
                    }
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