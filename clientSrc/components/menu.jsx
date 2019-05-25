import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import FileCopyIcon from '@material-ui/icons/FileCopyTwoTone';

export default function mainListItems(props) {
  return (
    <div>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Painel" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <FileCopyIcon />
        </ListItemIcon>
        <ListItemText primary="Contratos" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon onClick={props.onClick.bind(null, 'fornecedores')} />
        </ListItemIcon>
        <ListItemText primary="Fornecedores" />
      </ListItem>
    </div>
  );
}
