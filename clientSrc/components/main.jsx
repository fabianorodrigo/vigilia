import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Menu from './menu';
import useStyles from './styles';
import {Service} from '../lib/service';

import Painel from './painel';
import ListaFornecedores from './listaFornecedores';
import ListaContratos from './listaContratos';

export default function Main() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  //Buscando contratos
  const [contratos, setContratos] = React.useState([]);
  //Buscando fornecedores
  const [fornecedores, setFornecedores] = React.useState([]);
  //Buscando indicadores
  const [indicadores, setIndicadores] = React.useState([]);

  React.useEffect(() => {
    Service.getAll({nomeModeloPlural: 'fornecedores'}).then(response => {
      setFornecedores(response.data);
    });
    Service.getAll({nomeModeloPlural: 'contratos'}).then(response => {
      setContratos(response.data);
    });
    Service.getAll({nomeModeloPlural: 'indicadores'}).then(response => {
      setIndicadores(response.data);
    });
  }, []);

  const [value, setValue] = React.useState(0);
  function handleChange(newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Vigília - Gestão de Contratos
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Menu onClick={handleChange} />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {value == 'painel' && (
          <Painel
            fornecedores={fornecedores}
            contratos={contratos}
            indicadores={indicadores}
          />
        )}
        {value == 'contratos' && <ListaContratos />}
        {value == 'fornecedores' && <ListaFornecedores />}
      </main>
    </div>
  );
}
