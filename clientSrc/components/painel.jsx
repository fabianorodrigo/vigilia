import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/EditTwoTone';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartTwoTone';
import {Divider} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import useStyles from './styles';
import {Service} from '../lib/service';

export default function Painel(props) {
  const classes = useStyles();

  //Buscando ordens de servço
  const [ordens, setOrdens] = React.useState([]);

  React.useEffect(() => {
    Service.getAll({nomeModeloPlural: 'ordens-servico'}).then(response => {
      const ordens = response.data;
      for (const os of ordens) {
        const indicadoresOS = props.indicadores.filter(item => {
          return item.idContrato == os.idContrato && item.escopo == 'OS';
        });

        if (indicadoresOS.length > 0) {
          os.indicadores = indicadoresOS.map(indicador => {
            return {
              nome: indicador.nome,
              descricao: indicador.descricao,
              linguagemExecucao: indicador.linguagemExecucao,
              indice: eval(`(()=>{${indicador.script}})()`),
            };
          });
          console.log(os.indicadores);
        }
      }

      setOrdens(ordens);
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
      {ordens.map(os => {
        // fornecedor do contrato
        const contrato = props.contratos.find(item => {
          return item.id == os.idContrato;
        });
        // fornecedor do contrato
        const fornecedor = props.fornecedores.find(item => {
          return item.cnpj == contrato.cnpjFornecedor;
        });

        indexAvatarClass += 1;
        if (indexAvatarClass >= avatarClasses.length) {
          indexAvatarClass = 0;
        }
        return (
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={avatarClasses[indexAvatarClass]}
                alt={os.numeroOS}
              >
                {os.numeroOS}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={fornecedor.nomeFantasia}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    Número SEI: {os.numeroSEI}
                  </Typography>
                  {' Data de Abertura: '.concat(os.dataAbertura)}
                  <Table className={classes.table} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Indicador</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {os.indicadores &&
                        os.indicadores.map(row => (
                          <TableRow key={row.nome}>
                            <TableCell component="th" scope="row">
                              {row.nome}
                            </TableCell>
                            <TableCell>{row.descricao}</TableCell>
                            <TableCell>{row.indice.valor}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </React.Fragment>
              }
            />
            <Divider variant="middle" />
          </ListItem>
        );
      })}
    </List>
  );
}
