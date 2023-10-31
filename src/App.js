import './App.css';
import React from 'react';
import Papa from "papaparse";
import swal from 'sweetalert2';
import randomColor from 'randomcolor';
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
        this.teamColors = new Map();
        this.selectedYear= "2022-2023";
        this.state = { data: null, xAxis: "Gls", yAxis: "Gls", xMin: 0, xMax: 38, yMin: 0, yMax: 15, activeTeams: new Set() } // Updated
        this.logos = {
            "Arsenal": "https://i.etsystatic.com/37424896/r/il/137c95/4157715738/il_fullxfull.4157715738_3xm5.jpg",
            "Aston Villa": "https://static.vecteezy.com/system/resources/previews/015/863/703/original/aston-villa-logo-on-transparent-background-free-vector.jpg",
            "Bournemouth": "https://1000logos.net/wp-content/uploads/2018/07/AFC-Bournemouth-logo.jpg",
            "Brentford": "https://static.vecteezy.com/system/resources/previews/015/863/708/original/brentford-logo-on-transparent-background-free-vector.jpg",
            "Brighton": "https://1000logos.net/wp-content/uploads/2018/07/Brighton-Hove-Albion-logo.jpg",
            "Burnley": "https://1000logos.net/wp-content/uploads/2021/02/Burnley-logo.jpg",
            "Chelsea": "https://i.pinimg.com/474x/46/a2/7f/46a27f96e154a5d64bdf06747c534fa6.jpg",
            "Crystal Palace": "https://static.vecteezy.com/system/resources/previews/026/135/395/non_2x/crystal-palace-club-logo-black-and-white-symbol-premier-league-football-abstract-design-illustration-free-vector.jpg",
            "Everton": "https://logowik.com/content/uploads/images/everton-football-club4785.jpg",
            "Fulham": "https://s3.eu-west-1.amazonaws.com/gc-media-assets.fulhamfc.com/07a09500-8e25-11ea-b943-87fee4c4ba25.jpg",
            "Liverpool": "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo-1955-1968.jpg",
            "Luton Town": "https://www.hdwallpapers.in/download/emblem_logo_soccer_white_background_hd_luton_town_f_c-HD.jpg",
            "Manchester City": "https://i.pinimg.com/originals/3d/f7/e9/3df7e96bfafffcb2878b3b0c66e7af65.jpg",
            "Manchester Utd": "https://i.pinimg.com/originals/05/64/e2/0564e2514b9d8694cc8a34d04963e1a4.png",
            "Newcastle Utd": "https://logowik.com/content/uploads/images/744_newcastle_united_logo.jpg",
            "Nott'ham Forest": "https://i.pinimg.com/originals/68/0f/fa/680ffadd5aa7d0164592c231864d5122.jpg",
            "Sheffield Utd": "https://logowik.com/content/uploads/images/sheffield-united-fc1129.jpg",
            "Tottenham": "https://1000logos.net/wp-content/uploads/2018/06/Tottenham-Hotspur-2006.jpg",
            "West Ham": "https://static.vecteezy.com/system/resources/previews/026/135/477/original/west-ham-united-club-logo-black-symbol-premier-league-football-abstract-design-illustration-free-vector.jpg",
            "Wolves": "https://logowik.com/content/uploads/images/wolverhampton-wanderers-fc8015.jpg",
            "Leicester City": "https://i.ytimg.com/vi/_0-hi3l60UU/maxresdefault.jpg",
            "Leeds United": "https://images.alphacoders.com/115/1157439.png",
            "Southampton": "https://logowik.com/content/uploads/images/840_southamptonfc.jpg",
            "Watford": "https://www.watfordfc.com/storage/12239/conversions/Badge-8---Current-Crest-landscape_image.jpg",
            "West Brom": "https://1000logos.net/wp-content/uploads/2018/07/West-Bromwich-Albion-Logo-2000.jpg",
            "Norwich City": "https://logowik.com/content/uploads/images/norwich-city7754.jpg"
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

            this.setState({ ...this.state, data: processedData }, () => {
                this.updateAxis('xAxis', 'Gls');
                this.updateAxis('yAxis', 'Gls');
                this.setTeamColors();
            });
        })
    }

    setTeamColors() {
        let dataset = this.state.data;

        let teamNames = new Set();
        for (let player of dataset) {
            teamNames.add(player.Player.Squad);
        }

        let colors = randomColor({
            count: teamNames.size,
        });

        let i = 0;
        for (let team of teamNames) {
            this.teamColors.set(team, colors[i]);
            i++;
        }

        for (let i = 0; i < dataset.length; i++) {
            let team = dataset[i].Player.Squad;
            dataset[i].color = this.teamColors.get(team);
        }

        this.setState({ ...this.state, data: dataset });
    }

    updateAxis(axis, value) {
        let newState = this.state;
        let data = this.state.data.map(a => a['Performance'][value]);
        let min = Math.min.apply(0, data) - 0.5;
        let max = Math.max.apply(0, data) + 0.5;

        if (axis === 'xAxis') {
            newState.xMax = max;
            newState.xMin = min;
        } else if (axis === 'yAxis') {
            newState.yMax = max;
            newState.yMin = min;
        }

        newState[axis] = value;
        this.setState(newState);
    }

    createDropdown(axis) {
        if (this.state != null && this.state.data != null && this.state.data.length > 0) {
            let labels = Object.keys(this.state.data[0]['Performance']);
            let options = [...labels].map(a => {return {'value': a, 'label': a}});

            return (<Select className='Axis-Select' placeholder={"Select the " + axis} options={options} onChange={(value, label) => {this.updateAxis(axis, value.value)}} />)
        }
    }


    createChart() {
        if (this.state != null && this.state.data != null) {
            const dataPoints = this.state.data.map((line, i) => {
                const performance = line['Performance'];
                const coords = this.toPlotCoords(performance[this.state.xAxis], performance[this.state.yAxis]);
                const player = line['Player'];
                if(!(this.state.activeTeams.size === 0) && !this.state.activeTeams.has(player.Squad)) {
                    return null;
                }
                const x = coords.x;
                const y = coords.y;
                const color = line.color;

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
                if(dataPoint === null) return;
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
                    // Show a modal or do something with the data for this group of data points.
                    const modalContent = group.map((data) => {
                        const { player: groupPlayer, color: groupColor, xAxisName, yAxisName, xAxisValue, yAxisValue } = data;
                        return `${groupPlayer.Player} (Team: ${groupPlayer.Squad}, ${xAxisName}: ${xAxisValue}, ${yAxisName}: ${yAxisValue})`
                    }).join('\n');

                    swal.fire({
                        title: 'Players at ' + xAxisValue + ' ' + xAxisName + ', ' + yAxisValue + ' ' + yAxisName,
                        text: modalContent,
                        imageUrl: this.logos[player.Squad],
                        imageHeight: 100,
                    });
                };

                const handleHover = (e) => {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerHTML = `${player.Player}<br />Team: ${player.Squad}<br />Goals: ${xAxisValue}<br />Assists: ${yAxisValue}`;
                    tooltip.style.position = 'absolute';
                    tooltip.style.left = e.pageX+10 + 'px';
                    tooltip.style.top = e.pageY+10 + 'px';
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

        let options = [...this.teamColors.keys()].map(a => {return {'value': a, 'label': a}});
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
                    this.setState({...this.state, activeTeams: activeTeams});
                }} />
            </div>

        );
    }


    renderXAxis() {
        if(this.state.data === null) return;
        const data = this.state.data;
        const xAxisProperty = this.state.xAxis;
        const xValues = data ? data.map(line => parseFloat(line['Performance'][xAxisProperty])) : [];
        const yAxisProperty = this.state.yAxis;
        const yValues = data ? data.map(line => parseFloat(line['Performance'][yAxisProperty])) : [];
        const xMax = Math.max(...xValues);
        const xMin = Math.min(...xValues);
        const tickCount = xMax - xMin + 1; // You can adjust this based on your requirements
        const yAverage = yValues.reduce((acc, val) => acc + val, 0) / yValues.length;
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
        if(this.state.data === null) return;
        const data = this.state.data;
        const xAxisProperty = this.state.xAxis;
        const xValues = data ? data.map(line => parseFloat(line['Performance'][xAxisProperty])) : [];
        const yAxisProperty = this.state.yAxis;
        const yValues = data ? data.map(line => parseFloat(line['Performance'][yAxisProperty])) : [];
        const yMax = Math.max(...yValues);
        const yMin = Math.min(...yValues);
        const tickCount = yMax - yMin + 1; // You can adjust this based on your requirements
        const xAverage = xValues.reduce((acc, val) => acc + val, 0) / xValues.length;
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