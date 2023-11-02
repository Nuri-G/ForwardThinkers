import './App.css';
import React from 'react';
import Papa from "papaparse";
import swal from 'sweetalert2';
import Select from 'react-select';

function hexagonCoords(x, y, radius) {
    let angle = 0;
    let out = '';
    for (let i = 0; i < 6; i++) {
        let angleX = Math.cos(angle) * radius;
        let angleY = Math.sin(angle) * radius;

        if (i > 0) {
            out += ' ';
        }
        out += (x + angleX) + ',' + (y + angleY);

        angle += Math.PI / 3;
    }

    return out;
}

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
        this.selectedYear = "2022-2023";
        this.data = null;
        this.state = { activeData: null, xAxis: "Gls", yAxis: "Ast", xMin: 0, xMax: 38, xAverage: 1, yMin: 0, yMax: 15, yAverage: 1 } // Updated
        this.teamInfo = {
            "Arsenal": {
                logoUrl: "https://i.etsystatic.com/37424896/r/il/137c95/4157715738/il_fullxfull.4157715738_3xm5.jpg",
                color: "#EF0107"
            },
            "Aston Villa": {logoUrl: "https://static.vecteezy.com/system/resources/previews/015/863/703/original/aston-villa-logo-on-transparent-background-free-vector.jpg", 
                color: "#670E36"},
            "Bournemouth": {logoUrl: "https://1000logos.net/wp-content/uploads/2018/07/AFC-Bournemouth-logo.jpg", 
                color: "#8b0304"},
            "Brentford": {logoUrl: "https://static.vecteezy.com/system/resources/previews/015/863/708/original/brentford-logo-on-transparent-background-free-vector.jpg", 
                color: "#e30613"},
            "Brighton": {logoUrl: "https://1000logos.net/wp-content/uploads/2018/07/Brighton-Hove-Albion-logo.jpg", 
                color: "#005daa"},
            "Burnley": {logoUrl: "https://1000logos.net/wp-content/uploads/2021/02/Burnley-logo.jpg", 
                color: "#6b733d"},
            "Chelsea": {logoUrl: "https://i.pinimg.com/474x/46/a2/7f/46a27f96e154a5d64bdf06747c534fa6.jpg", 
                color: "#034694"},
            "Crystal Palace": {logoUrl: "https://static.vecteezy.com/system/resources/previews/026/135/395/non_2x/crystal-palace-club-logo-black-and-white-symbol-premier-league-football-abstract-design-illustration-free-vector.jpg", 
                color: "#1b458f"},
            "Everton": {logoUrl: "https://logowik.com/content/uploads/images/everton-football-club4785.jpg", 
                color: "#274488"},
            "Fulham": {logoUrl: "https://s3.eu-west-1.amazonaws.com/gc-media-assets.fulhamfc.com/07a09500-8e25-11ea-b943-87fee4c4ba25.jpg", 
                color: "#000000"},
            "Liverpool": {logoUrl: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo-1955-1968.jpg", 
                color: "#008875"},
            "Luton Town": {logoUrl: "https://www.hdwallpapers.in/download/emblem_logo_soccer_white_background_hd_luton_town_f_c-HD.jpg", 
                color: "##F78F1E"},
            "Manchester City": {logoUrl: "https://i.pinimg.com/originals/3d/f7/e9/3df7e96bfafffcb2878b3b0c66e7af65.jpg", 
                color: "#97c1e7"},
            "Manchester Utd": {logoUrl: "https://i.pinimg.com/originals/05/64/e2/0564e2514b9d8694cc8a34d04963e1a4.png", 
                color: "#da030e"},
            "Newcastle Utd": {logoUrl: "https://logowik.com/content/uploads/images/744_newcastle_united_logo.jpg", 
                color: "#f0b83d"},
            "Nott'ham Forest": {logoUrl: "https://i.pinimg.com/originals/68/0f/fa/680ffadd5aa7d0164592c231864d5122.jpg", 
                color: "#e53233"},
            "Sheffield Utd": {logoUrl: "https://logowik.com/content/uploads/images/sheffield-united-fc1129.jpg", 
                color: "#ccff00"},
            "Tottenham": {logoUrl: "https://1000logos.net/wp-content/uploads/2018/06/Tottenham-Hotspur-2006.jpg", 
                color: "#132257"},
            "West Ham": {logoUrl: "https://static.vecteezy.com/system/resources/previews/026/135/477/original/west-ham-united-club-logo-black-symbol-premier-league-football-abstract-design-illustration-free-vector.jpg", 
                color: "#7c2c3b"},
            "Wolves": {logoUrl: "https://logowik.com/content/uploads/images/wolverhampton-wanderers-fc8015.jpg", 
                color: "#fdb913"},
            "Leicester City": {logoUrl: "https://i.ytimg.com/vi/_0-hi3l60UU/maxresdefault.jpg", 
                color: "##003090"},
            "Leeds United": {logoUrl: "https://images.alphacoders.com/115/1157439.png", 
                color: "##1D428A"},
            "Southampton": {logoUrl: "https://logowik.com/content/uploads/images/840_southamptonfc.jpg", 
                color: "#ffc40d"},
            "Watford": {logoUrl: "https://www.watfordfc.com/storage/12239/conversions/Badge-8---Current-Crest-landscape_image.jpg", 
                color: "#ed2127"},
            "West Brom": {logoUrl: "https://1000logos.net/wp-content/uploads/2018/07/West-Bromwich-Albion-Logo-2000.jpg", 
                color: "#060067"},
            "Norwich City": {logoUrl: "https://logowik.com/content/uploads/images/norwich-city7754.jpg", 
                color: "#00a650"}
        };
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

            this.data = processedData;
            this.setState({ ...this.state, activeData: processedData }, () => {
                this.updateAxis('xAxis', this.state.xAxis);
                this.updateAxis('yAxis', this.state.yAxis);
            });
        })
    }

    updateAxis(axis, value) {
        let newState = this.state;
        let data = this.state.activeData.map(a => a['Performance'][value]);
        let min = Math.min(...data) - 0.5;
        let max = Math.max(...data) + 0.5;
        let average = data.reduce((acc, val) => Number(acc) + Number(val)) / data.length;

        if (axis === 'xAxis') {
            newState.xMax = max;
            newState.xMin = min;
            newState.xAverage = average;
        } else if (axis === 'yAxis') {
            newState.yMax = max;
            newState.yMin = min;
            newState.yAverage = average;
        }

        newState[axis] = value;
        this.setState(newState);
    }

    createDropdown(axis) {
        if (this.state != null && this.state.activeData != null && this.state.activeData.length > 0) {
            let labels = Object.keys(this.state.activeData[0]['Performance']);
            let options = [...labels].map(a => {return {'value': a, 'label': a}});

            return (<Select className='Axis-Select' placeholder={"Select the " + axis} options={options} onChange={(value, label) => {this.updateAxis(axis, value.value)}} />)
        }
    }


    createChart() {
        if (this.state != null && this.state.activeData != null) {
            const dataPoints = this.state.activeData.map((line, i) => {
                const performance = line['Performance'];
                const coords = this.toPlotCoords(performance[this.state.xAxis], performance[this.state.yAxis]);
                const player = line['Player'];
                const x = coords.x;
                const y = coords.y;
                const color = this.teamInfo[player.Squad].color;

                return {
                    player: player,
                    x: x,
                    y: y,
                    color: color,
                    xAxisName: this.state.xAxis,
                    yAxisName: this.state.yAxis,
                    xAxisValue: performance[this.state.xAxis],
                    yAxisValue: performance[this.state.yAxis]
                };
            });

            // Create an object to store data points with the same (x, y) coordinates
            const overlappingDataPoints = {};

            // Iterate through the data points and group them by (x, y) coordinates
            dataPoints.forEach((dataPoint) => {
                if (dataPoint === null) return;
                const { x, y } = dataPoint;
                const key = `${x}-${y}`;

                if (!overlappingDataPoints[key]) {
                    overlappingDataPoints[key] = [dataPoint];
                } else {
                    overlappingDataPoints[key].push(dataPoint);
                }
            });

            return Object.values(overlappingDataPoints).map((group, i) => {
                const { player, x, y, color, xAxisName, yAxisName, xAxisValue, yAxisValue } = group[0]; // Use the first data point in the group

                const handleClick = (e) => {
                    const firstData = group[0];
                    const { player: groupPlayer, color: groupColor, xAxisName, yAxisName, xAxisValue, yAxisValue } = firstData;
                    const modalContent = `${groupPlayer.Player} (Team: ${groupPlayer.Squad}, ${xAxisName}: ${xAxisValue}, ${yAxisName}: ${yAxisValue})`;

                    let currentIndex = 0;

                    const showModal = (index) => {
                        const currentPlayer = group[index];

                        if (currentPlayer) {
                            const { player, xAxisName, yAxisName, xAxisValue, yAxisValue } = currentPlayer;
                            const modalContent = `Team: ${player.Squad} ${xAxisName}: ${xAxisValue} ${yAxisName}: ${yAxisValue}`;
                            const isPreviousDisabled = index === 0;  // Disable "Previous" when at the first data point
                            const isNextDisabled = index === group.length - 1;

                            swal.fire({
                                title: player.Player,
                                text: modalContent,
                                imageUrl: this.teamInfo[player.Squad].logoUrl,
                                imageHeight: 100,
                                showCloseButton: true,
                                showCancelButton: !isPreviousDisabled,
                                showConfirmButton: !isNextDisabled,
                                confirmButtonText: 'Next',
                                cancelButtonText: 'Previous',
                                cancelButtonColor: '#7066e0',
                                footer: `Showing: ${index + 1} of ${group.length}`,
                                customClass: {
                                    actions: 'my-actions',
                                    cancelButton: 'order-1',
                                    confirmButton: 'order-2'
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    swal.close(); // Close the current modal
                                    showModal(index + 1);
                                } else {
                                    swal.close(); // Close the current modal
                                    showModal(index - 1);
                                }
                            });
                        }
                    };

                    showModal(currentIndex);
                };

                const handleHover = (e) => {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerHTML = `${player.Player}<br />Team: ${player.Squad}<br />Goals: ${xAxisValue}<br />Assists: ${yAxisValue}`;
                    tooltip.style.position = 'absolute';
                    tooltip.style.left = e.pageX + 10 + 'px';
                    tooltip.style.top = e.pageY + 10 + 'px';
                    tooltip.style.userSelect = 'none';
                    document.body.appendChild(tooltip);

                    const handleMouseLeave = () => {
                        document.body.removeChild(tooltip);
                        e.target.removeEventListener('mouseleave', handleMouseLeave);
                    };

                    e.target.addEventListener('mouseleave', handleMouseLeave);
                };


                return (
                    <polygon
                        points={hexagonCoords(x, y, 1)}
                        key={i}
                        r=".5"
                        fill={color}
                        onClick={handleClick}
                        onMouseEnter={handleHover}
                    />
                );
            });
        }
    }

    loadDatasetForSelectedYear() {
        const filename = `./data/${this.state.selectedYear}.csv`;
        this.loadDataset(filename);
    }

    render() {
        if (!this.loading) {
            this.loading = true;
            this.loadDataset("./data/2022-2023.csv");
        }

        let options = [...Object.keys(this.teamInfo)].map(a => {return {'value': a, 'label': a}});
        let yearoptions = [{ value: "2019-2020", label: "2019-2020" },
        { value: "2020-2021", label: "2020-2021" },{ value: "2021-2022", label: "2021-2022" },
        { value: "2022-2023", label: "2022-2023" }, { value: "2023-2024", label: "2023-2024" }]

        return ( //This box might need to be bigger as well, or we just make circles smaller
            <div>
                <Select placeholder = "Select Year..."
                options={yearoptions}
                onChange={(selectedOption) => {
                    this.setState(
                        { ...this.state, selectedYear: selectedOption.value, data: null },
                        () => this.loadDatasetForSelectedYear(selectedOption.value)
                    );
                }}/>
                {this.createDropdown("xAxis")}
                {this.createDropdown("yAxis")}
                <svg viewBox="0 0 100 50" style={{ border: '1px solid lightgrey', borderRadius: '5px', marginTop: '2px'}}>
                    {this.createChart()}
                    {this.renderXAxis()}
                    {this.renderYAxis()}
                </svg>
                <Select placeholder="Filter Teams..." isMulti options={options} onChange={(values, labels) => {
                    let activeTeams = new Set(values.map(a => a.value));
                    let activeData = this.data.filter(player => activeTeams.size === 0 || activeTeams.has(player.Player.Squad));
                    this.setState({ ...this.state, activeData: activeData }, () => {
                        this.updateAxis('xAxis', this.state.xAxis);
                        this.updateAxis('yAxis', this.state.yAxis);
                    });
                }} />
            </div>

        );
    }


    renderXAxis() {
        if (this.state.activeData === null) return;
        const xMax = this.state.xMax;
        const xMin = this.state.xMin;
        const tickCount = xMax - xMin + 1; // You can adjust this based on your requirements
        const yAverage = this.state.yAverage;
        const axisCoordinate = this.toPlotCoords(0, yAverage).y;

        return (
            <g>
                <line x1={0} y1={axisCoordinate} x2={this.width} y2={axisCoordinate} stroke="black" strokeWidth="0.1" />
                {Array.from({ length: tickCount }).map((_, i) => {
                    const value = xMin + i; // Calculate the tick value as a whole number
                    const { x } = this.toPlotCoords(value, 0); // Convert value to screen coordinates

                    if (i % 2 === 0) {
                        return (
                            <g key={i}>
                                <line x1={x} y1={axisCoordinate - 1} x2={x} y2={axisCoordinate + 1} stroke="black" strokeWidth="0.1" />
                                <text x={x} y={axisCoordinate + 3} fontSize="1" textAnchor="middle">{value}</text>
                            </g>
                        );
                    } else {
                        return (
                            <line x1={x} y1={axisCoordinate - 0.5} x2={x} y2={axisCoordinate + 0.5} stroke="black" strokeWidth="0.1" key={i} />
                        );
                    }
                })}
            </g>
        );

    }



    renderYAxis() {
        if (this.state.activeData === null) return;
        const yMax = this.state.yMax;
        const yMin = this.state.yMin;
        const tickCount = yMax - yMin + 1; // You can adjust this based on your requirements
        const xAverage = this.state.xAverage;
        const axisCoordinate = this.toPlotCoords(xAverage, 0).x;

        return (
            <g>
                <line x1={axisCoordinate} y1={0} x2={axisCoordinate} y2={this.height} stroke="black" strokeWidth="0.1" />
                {Array.from({ length: tickCount }).map((_, i) => {
                    const value = yMin + i; // Calculate the tick value as a whole number
                    const { y } = this.toPlotCoords(0, value); // Convert value to screen coordinates

                    if (i % 2 === 0) {
                        return (
                            <g key={i}>
                                <line x1={axisCoordinate - 1} y1={y} x2={axisCoordinate + 1} y2={y} stroke="black" strokeWidth="0.1" />
                                <text x={axisCoordinate - 1.5} y={y + 0.5} fontSize="1" textAnchor="end">{value}</text>
                            </g>
                        );
                    } else {
                        return (
                            <line x1={axisCoordinate - 0.5} y1={y} x2={axisCoordinate + 0.5} y2={y} stroke="black" strokeWidth="0.1" key={i} />
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