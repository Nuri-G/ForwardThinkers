import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: false,
    },
    {
        field: 'age',
        headerName: 'Age',
        width: 100,
        editable: false,
    },
    {
        field: 'team',
        headerName: 'Team',
        width: 150,
        editable: false,
    },
    {
        field: 'position',
        headerName: 'Position',
        width: 100,
        editable: false,
    },
    {
        field: 'goals',
        headerName: 'Goals',
        width: 100,
        editable: false,
      },
      {
        field: 'assists',
        headerName: 'Assists',
        width: 100,
        editable: false,
      },
      {
        field: 'totalPlaytime',
        headerName: 'Total Playtime (min.)',
        width: 200,
        editable: false,
      },
      {
        field: 'yellowCards',
        headerName: 'Yellow Cards',
        width: 200,
        editable: false,
      },
      {
        field: 'redCards',
        headerName: 'Red Cards',
        width: 200,
        editable: false,
      },
  ];

class Leaderboard extends React.Component {
    render() {
        let gridRows = this.props.activeData.map(row => 
            {return {id: row.Player.Rk, name: row.Player.Player, age: Number(row.Player.Age), goals: Number(row.Performance.Gls),
                assists: Number(row.Performance.Ast), team: row.Player.Squad, position: row.Player.Pos, 
                totalPlaytime: Number(row['Playing Time'].Min.replace(',', '')), yellowCards: Number(row.Performance.CrdY),
                redCards: Number(row.Performance.CrdR)}});

        return (<DataGrid
            rows={gridRows}
            columns={columns}
            sortingOrder={['desc', 'asc']}
            initialState={{
                pagination: {
                paginationModel: { page: 0, pageSize: 10 },
                },
                sorting: {
                sortModel: [
                    {
                    field: 'goals',
                    sort: 'desc',
                    },
                ],
                },
            }}
            pageSizeOptions={[5, 10]}
            />)
    }
} export default Leaderboard;