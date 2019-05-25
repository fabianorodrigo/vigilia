import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/EditTwoTone';
import FileCopyIcon from '@material-ui/icons/FileCopyTwoTone';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartTwoTone';

import {formataCNPJ} from '../lib/utils';
import {Service} from '../lib/service';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  blueAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: blue[500],
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
}));

function FornecedoresList() {
  const classes = useStyles();

  //Buscando fornecedores
  const [fornecedores, setFornecedores] = React.useState([]);
  //buscando lista de fornecedores

  React.useEffect(() => {
    Service.getAll({nomeModeloPlural: 'fornecedores'}).then(response => {
      setFornecedores(response.data);
    });
  }, []);

  const avatarClasses = [
    classes.blueAvatar,
    classes.pinkAvatar,
    classes.greenAvatar,
  ];
  let indexAvatarClass = 0;
  return (
    <List className={classes.root}>
      {fornecedores.map(f => {
        indexAvatarClass += 1;
        if (indexAvatarClass >= avatarClasses.length) {
          indexAvatarClass = 0;
        }
        return (
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={avatarClasses[indexAvatarClass]}
                alt={f.razaoSocial}
              >
                {f.razaoSocial.substr(0, 2)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={f.nomeFantasia}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {formataCNPJ(f.cnpj)}
                  </Typography>
                  {' - '.concat(f.razaoSocial)}
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="Editar">
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="Ver Contratos">
                <FileCopyIcon />
              </IconButton>
              <IconButton edge="end" aria-label="Ver Ordens de Serviço">
                <ShoppingCartIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

export default FornecedoresList;
