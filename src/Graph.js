import React from 'react';
import swal from 'sweetalert2';

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
    constructor() {
        super();
        this.width = 100;
        this.height = 50;
        
        this.state = { xAxis: "Gls", yAxis: "Ast"} // Updated
    }

    toPlotCoords(x, y) {
        let newX = ((x - this.minX()) / (this.maxX() - this.minX())) * this.width;
        let newY = 50 - ((y - this.minY()) / (this.maxY() - this.minY())) * this.height;
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
        return Math.min(...this.activeDataX()) - 1;
    }

    minY() {
        return Math.min(...this.activeDataY()) - 1;
    }

    maxX() {
        return Math.max(...this.activeDataX()) + 1;
    }

    maxY() {
        return Math.max(...this.activeDataY()) + 1;
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

            return {
                player: player,
                x: x,
                y: y,
                color: color,
                // xAxisName: this.props.xAxis,
                // yAxisName: this.props.yAxis,
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
            const { player, x, y, color, xAxisValue, yAxisValue } = group[0]; // Use the first data point in the group

            const handleClick = (e) => {
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
                            imageUrl: this.props.teamInfo[player.Squad].logoUrl,
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

    renderXAxis() {
        if (this.props.activeData === null) return;
        const xMax = this.maxX();
        const xMin = this.minX();
        const tickCount = xMax - xMin + 1; // You can adjust this based on your requirements
        const yAverage = this.averageY();
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
        if (this.props.activeData === null) return;
        const yMax = this.maxY();
        const yMin = this.minY();
        const tickCount = yMax - yMin + 1; // You can adjust this based on your requirements
        const xAverage = this.averageX();
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

    render() {
        return ( //This box might need to be bigger as well, or we just make circles smaller
            <div>
                <svg viewBox="0 0 100 50" style={{ border: '1px solid lightgrey', borderRadius: '5px', marginTop: '2px'}}>
                    {this.createChart()}
                    {this.renderXAxis()}
                    {this.renderYAxis()}
                </svg>
            </div>

        );
    }
} export default Graph;