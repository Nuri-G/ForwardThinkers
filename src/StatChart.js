import React from 'react';

/*
this.props.stats should have the following format with at least 3 stats:
[{
    name: 'stat name here',
    minValue: 0,
    maxValue: 3,
    value: 2.7
},
{
    name: 'stat name here',
    minValue: 0,
    maxValue: 2,
    value: 1.1
}]
*/

function coordString(coords) {
    return coords.reduce((a, b) => {
        if(a.x != null) {
            return a.x + ',' + a.y + ' ' + b.x + ',' + b.y;
        }
        return a + ' ' + b.x + ',' + b.y;
    });
}

function buildPolygon(n, size) {
    let x = 500;
    let y = 500;
    let radius = 500 * size;
    let angle = -Math.PI / 2;
    let out = [];
    for (let i = 0; i < n; i++) {
        let angleX = Math.cos(angle) * radius;
        let angleY = Math.sin(angle) * radius;
        out.push({x: (x + angleX), y: (y + angleY)});

        angle += Math.PI / n * 2;
    }

    return out;
}

function polygons(data) {
    let n = data.length;
    let outer = buildPolygon(n, 0.9);
    let inner = buildPolygon(n, 0.9);
    let center = buildPolygon(n, 0.01);
    let scaleMarkers = [];
    for(let i = 0; i < 3; i++) {
        scaleMarkers.push(buildPolygon(n, 0.9 / 4 * (i + 1)));
    }

    for(let i = 0; i < data.length; i++) {
        let curStat = data[i];
        let radius = (curStat.value - curStat.minValue) / (curStat.maxValue - curStat.minValue);
        inner[i].x = (inner[i].x - 500) * radius + 500;
        inner[i].y = (inner[i].y - 500) * radius + 500;
        outer[i].name = curStat.name;
    }

    return {outer: outer, inner: inner, center: center, scaleMarkers: scaleMarkers};
}

class StatChart extends React.Component {
    render() {
        let polys = polygons(this.props.stats);

        return (<svg viewBox={'0 0 1000 1000'} style={{backgroundColor: '#222222'}}>
            <polygon
                points={coordString(polys.inner)}
                fill='#ff6666'
                stroke='none'
            />
            <polygon
                points={coordString(polys.outer)}
                style={{fill:'none', stroke:'white', strokeWidth:1}}
            />
            <polygon points={coordString(polys.center)}></polygon>
            {polys.outer.map(coord => {
                return (<line x1='500' y1='500' x2={coord.x} y2={coord.y} stroke='#333333' style={{strokeWidth: 1, strokeDasharray: [10, 5]}}></line>)
            })}
            {polys.outer.map(coord => {
                return (<text x={coord.x} y={coord.y + 10} stroke='none' fontSize={30} style={{textAnchor: 'middle', fill: 'white', stroke: 'none'}}>{coord.name}</text>)
            })}
            {polys.scaleMarkers.map(polyCoords => {
                return (<polygon points={coordString(polyCoords)} fill='none' stroke='#333333'></polygon>)
            })}
        </svg>)
    }
} export default StatChart;