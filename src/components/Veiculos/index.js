import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  IconButton,
  Slide,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles/index";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: 30
  },
  title: {
    flexGrow: 1
  },
  table: {
    minWidth: 650
  },
  formControl: {
    margin: 10,
    minWidth: 120
  },
  btn: {
    width: 200,
    marginTop: 20
  }
});

class Veiculos extends React.Component {
  state = {
    loadingEdit: {},
    loadingSave: false,
    loadingDelete: {},
    veiculos: [],
    veiculo: {},
    open: false,
    loadingData: true
  };

  componentDidMount() {
    this.handleData();
  }

  handleData = async () => {
    const response = await axios.get("http://localhost:8000/api/v1/veiculos");
    this.setState({ veiculos: response.data, loadingData: false });
  };

  handleEdit = async id => {
    const { loadingEdit } = this.state;
    loadingEdit[id] = true;
    this.setState({ loadingEdit, loadingData: true });
    const response = await axios.get(
      `http://localhost:8000/api/v1/veiculos/${id}`
    );

    if (response.status === 200) {
      loadingEdit[id] = false;
      this.setState({
        veiculo: response.data,
        open: true,
        loadingEdit,
        loadingData: false
      });
    }
  };

  handleSave = async () => {
    const { veiculo } = this.state;
    this.setState({ loadingSave: true, loadingData: true });

    let response;

    if (veiculo.id) {
      response = await axios.put(
        `http://localhost:8000/api/v1/veiculos/${veiculo.id}`,
        veiculo
      );
    } else {
      response = await axios.post(
        `http://localhost:8000/api/v1/veiculos/`,
        veiculo
      );

      if (response.status === 200) {
        this.setState({ open: false, veiculo: {}, loadingData: false });
        this.handleData();
      }
    }

    this.setState({ loadingSave: false, loadingData: false });
  };

  handleDelete = async id => {
    const { loadingDelete } = this.state;
    loadingDelete[id] = true;
    this.setState({ loadingDelete, loadingData: true });
    const response = await axios.delete(
      `http://localhost:8000/api/v1/veiculos/${id}`
    );

    if (response.status === 200) {
      loadingDelete[id] = true;
      this.setState({ loadingDelete, loadingData: false }, () =>
        this.handleData()
      );
    }
  };

  handleChange = e => {
    const { veiculo } = this.state;
    veiculo[e.target.name] = e.target.value;
    this.setState({ veiculo });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      veiculos,
      veiculo,
      loadingEdit,
      loadingSave,
      loadingDelete,
      loadingData,
      open
    } = this.state;
    const { classes } = this.props;
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Veículos
            </Typography>
            <Button
              color="inherit"
              onClick={() => this.setState({ veiculo: {}, open: true })}
            >
              Adicionar
            </Button>
          </Toolbar>
        </AppBar>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="Veículos">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Veículo</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Ano</TableCell>
                <TableCell>Vendido</TableCell>
                <TableCell>Criado em</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {veiculos &&
                veiculos.map(item => (
                  <TableRow key={item.veiculo}>
                    <TableCell component="th" scope="row">
                      {item.id}
                    </TableCell>
                    <TableCell>{item.veiculo}</TableCell>
                    <TableCell>{item.marca}</TableCell>
                    <TableCell>{item.ano}</TableCell>
                    <TableCell>{item.vendido ? "Sim" : "Não"}</TableCell>
                    <TableCell>
                      {moment(item.created_at).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleEdit(item.id)}
                      >
                        {loadingEdit[item.id] ? (
                          <CircularProgress size={20} color="secondary" />
                        ) : (
                          "Editar"
                        )}
                      </Button>{" "}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleDelete(item.id)}
                      >
                        {loadingDelete[item.id] ? (
                          <CircularProgress size={20} color="secondary" />
                        ) : (
                          "Excluir"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          fullScreen
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {veiculo.veiculo ? veiculo.veiculo : "Novo Registro"}
              </Typography>
            </Toolbar>
          </AppBar>
          <FormControl
            className={classes.formControl}
            style={{ marginTop: 75 }}
          >
            <TextField
              type="text"
              name="veiculo"
              label="Veículo"
              value={veiculo ? veiculo.veiculo : ""}
              onChange={e => this.handleChange(e)}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              type="text"
              name="marca"
              label="Marca"
              value={veiculo ? veiculo.marca : ""}
              onChange={e => this.handleChange(e)}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              type="number"
              name="ano"
              label="Ano"
              value={veiculo ? veiculo.ano : ""}
              onChange={e => this.handleChange(e)}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              multiline
              rows="4"
              name="descricao"
              label="Descrição"
              value={veiculo ? veiculo.descricao : ""}
              onChange={e => this.handleChange(e)}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="vendido">Veículo vendido?</InputLabel>
            <Select
              labelId="vendido"
              name="vendido"
              id="vendido-select"
              value={veiculo ? veiculo.vendido : 0}
              onChange={e => this.handleChange(e)}
            >
              <MenuItem value={1}>Sim</MenuItem>
              <MenuItem value={0}>Não</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className={classes.btn}
            onClick={() => this.handleSave()}
          >
            {loadingSave ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              "Salvar"
            )}
          </Button>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={loadingData}
          autoHideDuration={6000}
          message="Aguarde..."
        />
      </>
    );
  }
}

export default withStyles(styles)(Veiculos);
