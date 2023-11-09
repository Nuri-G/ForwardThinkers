import './App.css';
import React from 'react';
import Papa from "papaparse";
import Select from 'react-select';
import Graph from './Graph'
import Leaderboard from './Leaderboard'

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
        logoUrl: "https://i.pinimg.com/originals/05/64/e2/0564e2514b9d8694cc8a34d04963e1a4.png",
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
        logoUrl: "https://static.vecteezy.com/system/resources/previews/026/135/477/original/west-ham-united-club-logo-black-symbol-premier-league-football-abstract-design-illustration-free-vector.jpg",
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
        color: "#EF0107" },
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

const yearOptions = [{ value: "2019-2020", label: "2019-2020" },
{ value: "2020-2021", label: "2020-2021" }, { value: "2021-2022", label: "2021-2022" },
{ value: "2022-2023", label: "2022-2023" }, { value: "2023-2024", label: "2023-2024" }]

async function fetchFile(filename) {
    const response = await fetch(filename);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(result.value);
    return text;
}

class App extends React.Component {
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
            this.setState({ ...this.state, activeData: processedData, activeTeams: [] });
        })
    }

    loadDatasetForSelectedYear() {
        const filename = `./data/${this.selectedYear}.csv`;
        this.loadDataset(filename);
    }

    createDropdown(axis) {
        if (this.state != null && this.state.activeData != null && this.state.activeData.length > 0) {
            let labels = Object.keys(this.state.activeData[0]['Performance']);
            let options = [...labels].map(a => { return { 'value': a, 'label': a } });

            return (<Select className='Axis-Select' value={{ value: this.state[axis], label: axis + ": " + this.state[axis] }} placeholder={"Select the " + axis} options={options} onChange={(value, label) => {
                let state = this.state;
                state[axis] = value.value;
                this.setState(state);
            }} />)
        }
    }

    constructor() {
        super();

        this.data = null;
        this.loading = false;
        this.selectedYear = "2022-2023";
        this.state = {activeData: null, xAxis: 'Gls', yAxis: 'Ast', activeTeams: []};
    }

    render() {
        if (!this.loading) {
            this.loading = true;
            this.loadDatasetForSelectedYear();
        }

        if (this.state.activeData == null) {
            return <p>Loading...</p>
        }

        let dropdownTeamOptions = new Set();
        for (let player of this.data) {
            dropdownTeamOptions.add(player.Player.Squad);
        }
        dropdownTeamOptions = [...dropdownTeamOptions].map(a => { return { 'value': a, 'label': a } });

        return (
            <div className="App">
                <Select placeholder = "Select Year..."
                value={{value: this.selectedYear, label: 'Selected Year: ' + this.selectedYear}}
                options={yearOptions}
                onChange={(selectedOption) => {
                    this.selectedYear = selectedOption.value;
                    this.loadDatasetForSelectedYear(selectedOption.value);
                }}/>
                <div className='LeaderboardContainer'>
                    <Leaderboard activeData={this.state.activeData} className='LeaderboardContainer'></Leaderboard>
                </div>
                <div className='GraphContainer' onClick={this.props.onCLick}>
                    {this.createDropdown("xAxis")}
                    {this.createDropdown("yAxis")}
                    <Graph activeData={this.data} xAxis={this.state.xAxis} yAxis={this.state.yAxis} teamInfo={teamInfo} width={100} height={79}></Graph>
                </div>
                <Select placeholder="Filter Teams..." isMulti value={this.state.activeTeams} options={dropdownTeamOptions} onChange={(values, labels) => {
                    let activeTeams = new Set(values.map(a => a.value));
                    let activeData = this.data.filter(player => activeTeams.size === 0 || activeTeams.has(player.Player.Squad));
                    this.setState({ ...this.state, activeData: activeData, activeTeams: [...activeTeams].map(a => { return { 'value': a, 'label': a } }) });

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

                    // Revert all teams colors when no filter is applied
                    if (values.length === 0) {
                        for (const team of Object.keys(teamInfo)) {
                            teamInfo[team].color = originalTeamColors[team].color;
                        }
                    }
                }} />
            </div>
        );
    }
}

export default App;