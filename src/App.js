import './App.css';
import React from 'react';
import Papa from "papaparse";
import Select from 'react-select';
import Graph from './Graph'
import Leaderboard from './Leaderboard'
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import StatChart from './StatChart';
import { Button } from '@mui/material';

const teamInfo = {
    "Arsenal": {
        logoUrl: "https://i.etsystatic.com/37424896/r/il/137c95/4157715738/il_fullxfull.4157715738_3xm5.jpg",
        color: "#EF0107"
    },
    "Aston Villa": {
        logoUrl: "https://static.vecteezy.com/system/resources/previews/015/863/703/original/aston-villa-logo-on-transparent-background-free-vector.jpg",
        color: "#670E36"
    },
    "Bournemouth": {
        logoUrl: "https://1000logos.net/wp-content/uploads/2018/07/AFC-Bournemouth-logo.jpg",
        color: "#8b0304"
    },
    "Brentford": {
        logoUrl: "https://static.vecteezy.com/system/resources/previews/015/863/708/original/brentford-logo-on-transparent-background-free-vector.jpg",
        color: "#e30613"
    },
    "Brighton": {
        logoUrl: "https://1000logos.net/wp-content/uploads/2018/07/Brighton-Hove-Albion-logo.jpg",
        color: "#005daa"
    },
    "Burnley": {
        logoUrl: "https://1000logos.net/wp-content/uploads/2021/02/Burnley-logo.jpg",
        color: "#6b733d"
    },
    "Chelsea": {
        logoUrl: "https://i.pinimg.com/474x/46/a2/7f/46a27f96e154a5d64bdf06747c534fa6.jpg",
        color: "#034694"
    },
    "Crystal Palace": {
        logoUrl: "https://static.vecteezy.com/system/resources/previews/026/135/395/non_2x/crystal-palace-club-logo-black-and-white-symbol-premier-league-football-abstract-design-illustration-free-vector.jpg",
        color: "#1b458f"
    },
    "Everton": {
        logoUrl: "https://logowik.com/content/uploads/images/everton-football-club4785.jpg",
        color: "#274488"
    },
    "Fulham": {
        logoUrl: "https://s3.eu-west-1.amazonaws.com/gc-media-assets.fulhamfc.com/07a09500-8e25-11ea-b943-87fee4c4ba25.jpg",
        color: "#000000"
    },
    "Liverpool": {
        logoUrl: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo-1955-1968.jpg",
        color: "#008875"
    },
    "Luton Town": {
        logoUrl: "https://www.hdwallpapers.in/download/emblem_logo_soccer_white_background_hd_luton_town_f_c-HD.jpg",
        color: "#F78F1E"
    },
    "Manchester City": {
        logoUrl: "https://i.pinimg.com/originals/3d/f7/e9/3df7e96bfafffcb2878b3b0c66e7af65.jpg",
        color: "#97c1e7"
    },
    "Manchester Utd": {
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
        color: "#da030e"
    },
    "Newcastle Utd": {
        logoUrl: "https://logowik.com/content/uploads/images/744_newcastle_united_logo.jpg",
        color: "#f0b83d"
    },
    "Nott'ham Forest": {
        logoUrl: "https://i.pinimg.com/originals/68/0f/fa/680ffadd5aa7d0164592c231864d5122.jpg",
        color: "#e53233"
    },
    "Sheffield Utd": {
        logoUrl: "https://logowik.com/content/uploads/images/sheffield-united-fc1129.jpg",
        color: "#ccff00"
    },
    "Tottenham": {
        logoUrl: "https://1000logos.net/wp-content/uploads/2018/06/Tottenham-Hotspur-2006.jpg",
        color: "#132257"
    },
    "West Ham": {
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/West_Ham_United_FC_logo.svg/640px-West_Ham_United_FC_logo.svg.png",
        color: "#7c2c3b"
    },
    "Wolves": {
        logoUrl: "https://logowik.com/content/uploads/images/wolverhampton-wanderers-fc8015.jpg",
        color: "#fdb913"
    },
    "Leicester City": {
        logoUrl: "https://i.ytimg.com/vi/_0-hi3l60UU/maxresdefault.jpg",
        color: "#003090"
    },
    "Leeds United": {
        logoUrl: "https://images.alphacoders.com/115/1157439.png",
        color: "#1D428A"
    },
    "Southampton": {
        logoUrl: "https://logowik.com/content/uploads/images/840_southamptonfc.jpg",
        color: "#ffc40d"
    },
    "Watford": {
        logoUrl: "https://www.watfordfc.com/storage/12239/conversions/Badge-8---Current-Crest-landscape_image.jpg",
        color: "#ed2127"
    },
    "West Brom": {
        logoUrl: "https://1000logos.net/wp-content/uploads/2018/07/West-Bromwich-Albion-Logo-2000.jpg",
        color: "#060067"
    },
    "Norwich City": {
        logoUrl: "https://logowik.com/content/uploads/images/norwich-city7754.jpg",
        color: "#00a650"
    }
};

const originalTeamColors = {
    "Arsenal": {
        color: "#EF0107"
    },
    "Aston Villa": {
        color: "#670E36"
    },
    "Bournemouth": {
        color: "#8b0304"
    },
    "Brentford": {
        color: "#e30613"
    },
    "Brighton": {
        color: "#005daa"
    },
    "Burnley": {
        color: "#6b733d"
    },
    "Chelsea": {
        color: "#034694"
    },
    "Crystal Palace": {
        color: "#1b458f"
    },
    "Everton": {
        color: "#274488"
    },
    "Fulham": {
        color: "#000000"
    },
    "Liverpool": {
        color: "#008875"
    },
    "Luton Town": {
        color: "#F78F1E"
    },
    "Manchester City": {
        color: "#97c1e7"
    },
    "Manchester Utd": {
        color: "#da030e"
    },
    "Newcastle Utd": {
        color: "#f0b83d"
    },
    "Nott'ham Forest": {
        color: "#e53233"
    },
    "Sheffield Utd": {
        color: "#ccff00"
    },
    "Tottenham": {
        color: "#132257"
    },
    "West Ham": {
        color: "#7c2c3b"
    },
    "Wolves": {
        color: "#fdb913"
    },
    "Leicester City": {
        color: "#003090"
    },
    "Leeds United": {
        color: "#1D428A"
    },
    "Southampton": {
        color: "#ffc40d"
    },
    "Watford": {
        color: "#ed2127"
    },
    "West Brom": {
        color: "#060067"
    },
    "Norwich City": {
        color: "#00a650"
    }
}

const labelMappings = {
    'Gls': 'Goals',
    'Ast': 'Assists',
    'G+A': 'Goals + Assists',
    'G-PK': 'Goals - Penalty Kicks',
    'PK': 'Penalty Kicks',
    'PKatt': 'Penalties Attempted',
    'CrdY': 'Yellow Cards',
    'CrdR': 'Red Cards'
};

const yearOptions = [{ value: "2019-2020", label: "2019-2020" },
{ value: "2020-2021", label: "2020-2021" }, { value: "2021-2022", label: "2021-2022" },
{ value: "2022-2023", label: "2022-2023" }, { value: "2023-2024", label: "2023-2024" }]

async function fetchFile(filename) {
    const response = await fetch(filename);
    return await response.text();
}

class App extends React.Component {
    loadDataset(filename) {
        fetchFile(filename).then(text => {
            let p = Papa.parse(text)
            let data = p.data;
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
            this.setState({ ...this.state, activeData: processedData, activeTeams: [] });
        })
    }

    loadDatasetForSelectedYear() {
        const filename = `./data/${this.state.selectedYear}.csv`;
        this.loadDataset(filename);
    }


    createDropdown(axis) {
        if (this.state != null && this.state.activeData != null && this.state.activeData.length > 0) {
            let labels = Object.keys(this.state.activeData[0]['Performance']);
            let options = [...labels].map(a => {
                const mappedLabel = labelMappings[a] || a; // Use the mapping or fallback to the original label
                return { 'value': a, 'label': mappedLabel };
            });

            return (
                <Select
                    className='Axis-Select'
                    value={{ value: this.state[axis], label: axis + ": " + labelMappings[this.state[axis]] }}
                    placeholder={"Select the " + axis}
                    options={options}
                    onChange={(value, label) => {
                        let state = this.state;
                        state[axis] = value.value;
                        this.setState(state);
                    }}
                />
            );
        }
    }

    setTeamColors(activeTeams) {
        activeTeams = new Set(activeTeams.map(a => a.value));
        // Revert all teams colors when no filter is applied
        if (activeTeams.size === 0) {
            for (const team of Object.keys(teamInfo)) {
                teamInfo[team].color = originalTeamColors[team].color;
            }
        } else {
            // Change the color of unselected teams to gray
            for (const team of Object.keys(teamInfo)) {
                if (!activeTeams.has(team)) {
                    teamInfo[team].color = "#E0E0E0";
                    teamInfo[team].active = false;
                } else {
                    teamInfo[team].color = originalTeamColors[team].color;
                    teamInfo[team].active = true;
                }
            }
        }
    }


    constructor() {
        super();

        this.data = null;
        this.loading = false;
        this.state = { activeData: null, selectedYear: "2022-2023", xAxis: 'Gls', yAxis: 'Ast', activeTeams: [] };
    }

    componentDidMount() {
        this.loadDatasetForSelectedYear();
    }

    componentDidUpdate() {
        if (!this.loading) {
            this.loadDatasetForSelectedYear();
            this.loading = true;
        }
    }

    handleButtonClick = (e) => {


        let currentPlayer = this.data.find(element => { return element.Player.Player === this.selectedPlayer1.value; });
        let currentPlayer1 = this.data.find(element => { return element.Player.Player === this.selectedPlayer2.value; });

        const showModal = () => {
            if (currentPlayer) {
                let player = currentPlayer.Player;
                let player1 = currentPlayer1.Player;
                let chartStats = [{
                    name: 'Goals',
                    minValue: 0,
                    maxValue: Math.max(...this.data.map(a => a.Performance.Gls)),
                    value: currentPlayer.Performance.Gls,
                    value1: currentPlayer1.Performance.Gls
                },
                {
                    name: 'Assists',
                    minValue: 0,
                    maxValue: Math.max(...this.data.map(a => a.Performance.Ast)),
                    value: currentPlayer.Performance.Ast,
                    value1: currentPlayer1.Performance.Ast
                },
                {
                    name: 'Minutes Played',
                    minValue: 0,
                    maxValue: Math.max(...this.data.map(a => Number(a['Playing Time'].Min.replace(',', '')))),
                    value: Number(currentPlayer['Playing Time'].Min.replace(',', '')),
                    value1: Number(currentPlayer1['Playing Time'].Min.replace(',', '')),
                },
                {
                    name: 'Expected Goals',
                    minValue: 0,
                    maxValue: Math.max(...this.data.map(a => a['Expected'].xG)),
                    value: currentPlayer['Expected'].xG,
                    value1: currentPlayer1['Expected'].xG,
                },
                {
                    name: 'Progressive Carries',
                    minValue: 0,
                    maxValue: Math.max(...this.data.map(a => a['Progression'].PrgC)),
                    value: currentPlayer['Progression'].PrgC,
                    value1: currentPlayer1['Progression'].PrgC,
                },
                {
                    name: 'Progressive Passes',
                    minValue: 0,
                    maxValue: Math.max(...this.data.map(a => a['Progression'].PrgP)),
                    value: currentPlayer['Progression'].PrgP,
                    value1: currentPlayer1['Progression'].PrgP,
                }];

                withReactContent(swal).fire({
                    title: (<div>
                        <p style={{ color: 'red' }}>{player.Player}</p>
                        <p style={{ marginTop: '-30px' }}>vs.</p>
                        <p style={{ color: 'green', marginTop: '-30px' }}>{player1.Player}</p>
                    </div>),
                    html: (<StatChart stats={chartStats}></StatChart>),
                });
            }
        };

        showModal();
    };


    render() {
        if (this.state.activeData == null) {
            return <p>Loading...</p>
        }

        let dropdownPlayerOptions = new Set();
        for (let player of this.data) {
            dropdownPlayerOptions.add(player.Player.Player);
        }
        dropdownPlayerOptions = [...dropdownPlayerOptions].map(a => { return { 'value': a, 'label': a } });

        let dropdownTeamOptions = new Set();
        for (let player of this.data) {
            dropdownTeamOptions.add(player.Player.Squad);
        }
        dropdownTeamOptions = [...dropdownTeamOptions].map(a => { return { 'value': a, 'label': a } });

        this.setTeamColors(this.state.activeTeams);


        return (
            <div className="App">

                <div className='FilterSelectionContainer' style={{ border: "3px solid lightgrey" }}>
                    <Select className="DropdownMenu" placeholder="Select Year..."
                        value={{ value: this.state.selectedYear, label: 'Selected Year: ' + this.state.selectedYear }}
                        options={yearOptions}
                        onChange={(selectedOption) => {
                            this.loading = false;
                            this.setState({ ...this.state, selectedYear: selectedOption.value })
                        }} />

                    <Select placeholder="Filter Teams..." isMulti value={this.state.activeTeams} options={dropdownTeamOptions} onChange={(values, labels) => {
                        let activeTeams = new Set(values.map(a => a.value));
                        let activeData = this.data.filter(player => activeTeams.size === 0 || activeTeams.has(player.Player.Squad));
                        this.setState({ ...this.state, activeData: activeData, activeTeams: [...activeTeams].map(a => { return { 'value': a, 'label': a } }) });
                    }} />

                </div>
                <br></br>

                <div className="FlexContainer">
                    <div className='LeaderboardContainer' >

                        <Leaderboard activeData={this.state.activeData} className='LeaderboardContainer'></Leaderboard>

                        <br></br>
                        <div style={{ border: "2px solid lightgrey" }}>
                            <Select
                                className='DropdownMenu'
                                placeholder="Select Player 1..."
                                value={this.state.selectedPlayer1}
                                options={dropdownPlayerOptions}
                                onChange={(selectedOption) => {
                                    this.selectedPlayer1 = selectedOption;
                                }}
                            />
                            <Select
                                className='DropdownMenu'
                                placeholder="Select Player 2..."
                                value={this.state.selectedPlayer2}
                                options={dropdownPlayerOptions}
                                onChange={(selectedOption) => {
                                    this.selectedPlayer2 = selectedOption;
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={this.handleButtonClick}
                                style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}
                            >Compare Players
                            </Button>

                        </div>
                    </div>

                    <div className='GraphContainer' onClick={this.props.onCLick}>
                        {this.createDropdown("xAxis")}
                        {this.createDropdown("yAxis")}

                        <Graph activeData={this.data} xAxis={this.state.xAxis} yAxis={this.state.yAxis} teamInfo={teamInfo} width={100} height={79}></Graph>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;