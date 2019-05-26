import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import FileCopyIcon from '@material-ui/icons/FileCopyTwoTone';

export default function mainListItems(props) {
  return (
    <div>
      <ListItem button onClick={props.onClick.bind(null, 'painel')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Painel" />
      </ListItem>
      <ListItem button onClick={props.onClick.bind(null, 'contratos')}>
        <ListItemIcon>
          <FileCopyIcon />
        </ListItemIcon>
        <ListItemText primary="Contratos" />
      </ListItem>
      <ListItem button onClick={props.onClick.bind(null, 'fornecedores')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Fornecedores" />
      </ListItem>
    </div>
  );
}
