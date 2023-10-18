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
        this.state = {data: null, xAxis: "", yAxis: ""}
    }

    loadDataset(filename) {
        fetchFile(filename).then(text => {
            this.setState({...this.state, data: Papa.parse(text).data});
        })
    }

    setColor(i) {
        let dataset = this.state.data;
        dataset[i][2] = "red";
        this.setState(dataset);
    }

    createDropdown(axis) {
        if(this.state != null && this.state.data != null) {
            let labels = this.state.data[1];
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
                if(i < 2) {
                    return null;
                }
                let x = 50;
                let y = 25;
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
            this.loadDataset("./data/2023-2024.csv");
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