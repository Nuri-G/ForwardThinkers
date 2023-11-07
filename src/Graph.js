import React from 'react';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import StatChart from './StatChart';

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

class Graph extends React.Component {
    toPlotCoords(x, y) {
        let newX = ((x - this.minX()) / (this.maxX() - this.minX())) * this.props.width;
        let newY = this.props.height - ((y - this.minY()) / (this.maxY() - this.minY())) * this.props.height;
        return {
            'x': newX,
            'y': newY,
        }
    }

    activeDataX() {
        return this.props.activeData.map(a => a['Performance'][this.props.xAxis]);
    }

    activeDataY() {
        return this.props.activeData.map(a => a['Performance'][this.props.yAxis]);
    }

    averageX() {
        let data = this.activeDataX();

        return data.reduce((acc, val) => Number(acc) + Number(val)) / data.length;
    }

    averageY() {
        let data = this.activeDataY();

        return data.reduce((acc, val) => Number(acc) + Number(val)) / data.length;
    }

    minX() {
        return Math.min(...this.activeDataX());
    }

    minY() {
        return Math.min(...this.activeDataY());
    }

    maxX() {
        return Math.max(...this.activeDataX());
    }

    maxY() {
        return Math.max(...this.activeDataY());
    }

    renderXAxisLabel() {
        const xLabel = this.props.xAxis; // Assuming this is the selected label for X axis
        const margin = 5;
        const xLabelX = (this.props.width + margin)/ 2;
        const xLabelY = this.props.height + margin-2;

        return (
            <text x={xLabelX} y={xLabelY} textAnchor="middle" fontSize="2">
                {xLabel}
            </text>
        );
    }
    renderYAxisLabel() {
        const yLabel = this.props.yAxis; // Assuming this is the selected label for Y axis
        const margin = 5;
        const yLabelX = -2;
        const yLabelY = (this.props.height + margin) / 2;

        return (
            <text x={yLabelX} y={yLabelY} textAnchor="end" fontSize="2" transform={`rotate(-90, ${yLabelX}, ${yLabelY})`}>
                {yLabel}
            </text>
        );
    }


    createChart() {
        const dataPoints = this.props.activeData.map((line, i) => {
            const performance = line['Performance'];
            const coords = this.toPlotCoords(performance[this.props.xAxis], performance[this.props.yAxis]);
            const player = line['Player'];
            const x = coords.x;
            const y = coords.y;
            let color = this.props.teamInfo[player.Squad].color;
            if(color == null) {
                color = 'red';
            }

           // console.log(this.props.teamInfo[player.Squad].color)

            return {
                stats: line,
                x: x,
                y: y,
                color: color,
                xAxisValue: performance[this.props.xAxis],
                yAxisValue: performance[this.props.yAxis]
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
            const { stats, x, y, color, xAxisValue, yAxisValue } = group[0]; // Use the first data point in the group
            let player = stats.Player

            const handleClick = (e) => {
                let currentIndex = 0;

                const showModal = (index) => {
                    const currentPlayer = group[index];

                    if (currentPlayer) {
                        player = currentPlayer.stats.Player;
                        const isPreviousDisabled = index === 0;  // Disable "Previous" when at the first data point
                        const isNextDisabled = index === group.length - 1;
                        let chartStats = [{
                            name: 'Goals',
                            minValue: 0,
                            maxValue: Math.max(...this.props.activeData.map(a => a.Performance.Gls)),
                            value: currentPlayer.stats.Performance.Gls
                        },
                        {
                            name: 'Assists',
                            minValue: 0,
                            maxValue: Math.max(...this.props.activeData.map(a => a.Performance.Ast)),
                            value: currentPlayer.stats.Performance.Ast
                        },
                        {
                            name: 'Minutes Played',
                            minValue: 0,
                            maxValue: Math.max(...this.props.activeData.map(a => Number(a['Playing Time'].Min.replace(',', '')))),
                            value: Number(currentPlayer.stats['Playing Time'].Min.replace(',', ''))
                        },
                        {
                            name: 'Expected Goals',
                            minValue: 0,
                            maxValue: Math.max(...this.props.activeData.map(a => a['Expected'].xG)),
                            value: currentPlayer.stats['Expected'].xG
                        },
                        {
                            name: 'Progressive Carries',
                            minValue: 0,
                            maxValue: Math.max(...this.props.activeData.map(a => a['Progression'].PrgC)),
                            value: currentPlayer.stats['Progression'].PrgC
                        },
                        {
                            name: 'Progressive Passes',
                            minValue: 0,
                            maxValue: Math.max(...this.props.activeData.map(a => a['Progression'].PrgP)),
                            value: currentPlayer.stats['Progression'].PrgP
                        }];

                        withReactContent(swal).fire({
                            title: player.Player,
                            html: (<StatChart stats={chartStats}></StatChart>),
                            imageUrl: this.props.teamInfo[player.Squad].logoUrl,
                            imageHeight: 100,
                            showCloseButton: true,
                            showDenyButton: !isPreviousDisabled,
                            showConfirmButton: !isNextDisabled,
                            confirmButtonText: 'Next',
                            denyButtonText: 'Previous',
                            denyButtonColor: '#7066e0',
                            footer: `Showing: ${index + 1} of ${group.length}`,
                            customClass: {
                                actions: 'my-actions',
                                denyButton: 'order-1',
                                confirmButton: 'order-2'
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                swal.close();
                                showModal(index + 1);
                            } else if (result.isDenied) {
                                swal.close();
                                showModal(index - 1);
                            } else {
                                swal.close();
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
                tooltip.style.userSelect = 'none';
                tooltip.style.backgroundColor = 'rgb(255, 255, 255)';
                tooltip.style.border = '1.5px solid rgb(0, 0, 0)'; // Set a 1px solid black border
                tooltip.style.padding = '5px'

                const offsetX = 10; // Adjust this value as needed for spacing
                
                // Since you need the height, you have to set the tooltip into the document
                // temporarily to measure the height
                document.body.appendChild(tooltip);
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                document.body.removeChild(tooltip); // Remove it after measurement
                
                // Calculate the positions
                let leftPosition = e.pageX + offsetX;
                let topPosition = e.pageY + offsetX;
                
                // Adjust positions if tooltip goes beyond window boundaries
                if (leftPosition + tooltipWidth > window.innerWidth) {
                    leftPosition = window.innerWidth - tooltipWidth - offsetX;
                }
                
                if (topPosition + tooltipHeight > window.innerHeight) {
                    topPosition = window.innerHeight - tooltipHeight - offsetX;
                }
                
                tooltip.style.left = leftPosition + 'px';
                tooltip.style.top = topPosition + 'px'; // Correct 'py' typo
                
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

    renderXAxis() {
        if (this.props.activeData === null) return;
        const xMax = this.maxX();
        const xMin = this.minX();
        const tickCount = xMax - xMin + 1; // You can adjust this based on your requirements
        const yAverage = this.averageY();
        const axisCoordinate = this.toPlotCoords(0, yAverage).y;

        return (
            <g>
                <line x1={0} y1={axisCoordinate} x2={this.props.width} y2={axisCoordinate} stroke="black" strokeWidth="0.1" />
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
        if (this.props.activeData === null) return;
        const yMax = this.maxY();
        const yMin = this.minY();
        const tickCount = yMax - yMin + 1; // You can adjust this based on your requirements
        const xAverage = this.averageX();
        const axisCoordinate = this.toPlotCoords(xAverage, 0).x;

        return (
            <g>
                <line x1={axisCoordinate} y1={0} x2={axisCoordinate} y2={this.props.height} stroke="black" strokeWidth="0.1" />
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

    render() {
        const margin = 5;
        const viewBoxWidth = this.props.width + margin * 2;
        const viewBoxHeight = this.props.height + margin * 2;

        return ( //This box might need to be bigger as well, or we just make circles smaller
        <svg viewBox={`-${margin} -${margin} ${viewBoxWidth} ${viewBoxHeight}`} style={{ border: '1px solid lightgrey', borderRadius: '5px', marginTop: '2px', zIndex: '2' }}>
                {this.createChart()}
                {this.renderXAxis()}
                {this.renderYAxis()}
                {this.renderXAxisLabel()}
                {this.renderYAxisLabel()}
            </svg>
        );
    }
} export default Graph;