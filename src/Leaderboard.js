import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

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

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .first': {
      backgroundColor: '#F0cf59',
    },
    '& .second': {
      backgroundColor: '#E9e8e1',
    },
    '& .third': {
      backgroundColor: '#E1c190',
    },
  }));
  
  class Leaderboard extends React.Component {
    render() {
        let gridRows = this.props.activeData.map(row => 
            {return {id: row.Player.Rk, name: row.Player.Player, age: Number(row.Player.Age), goals: Number(row.Performance.Gls),
                assists: Number(row.Performance.Ast), team: row.Player.Squad, position: row.Player.Pos, 
                totalPlaytime: Number(row['Playing Time'].Min.replace(',', '')), yellowCards: Number(row.Performance.CrdY),
                redCards: Number(row.Performance.CrdR)}});
  
      return (
        <div style={{ height: 400, width: '100%' }}>
          <StripedDataGrid
            rows={gridRows}
            columns={columns}
            sortingOrder={['desc', 'asc']}
            pageSizeOptions={[5, 10]}
            getRowClassName={(params) =>{
              if (params.indexRelativeToCurrentPage === 0) {
                return 'first'; // Apply gold color to the first row
              } else if (params.indexRelativeToCurrentPage === 1) {
                return 'second'; // Apply silver color to the second row
              } else if (params.indexRelativeToCurrentPage === 2) {
                return 'third'; // Apply bronze color to the third row
              }
            }}
          />
        </div>
      );
    }
  }
  
  export default Leaderboard;