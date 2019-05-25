import React from 'react';

import {Service} from '../lib/service';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function getModalStyle() {
  return {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function FormFornecedorModal() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    url: '',
  });

  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value});
  };
  const [open, setOpen] = React.useState(false);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="standard-name"
            label="Razão Social"
            className={classes.textField}
            value={values.razaoSocial}
            onChange={handleChange('razaoSocial')}
            margin="normal"
          />
        </form>
      </Modal>
    </div>
  );
}

export default FormFornecedorModal;
