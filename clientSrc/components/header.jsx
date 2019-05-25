import React from "react";
import { Link } from 'react-router-dom';
import { FormControl } from 'react-bootstrap';
import Menu from "./menu.jsx";

class Header extends React.Component {

  opcoesIdiomas() {
    const idiomas = [];
    idiomas.push(<option key="pt" value="pt">Português</option>);
    idiomas.push(<option key="en" value="en">English</option>);
    idiomas.push(<option key="es" value="es">Español</option>);
    idiomas.push(<option key="fr" value="fr">Français</option>);
    idiomas.push(<option key="it" value="it">Italiano</option>);
    idiomas.push(<option key="de" value="de">Deutsch</option>);
    return idiomas;
  }

  updateLanguage(event) {
    this.props.updateLanguage(event.target.value);
  }

  render() {
    return (<header className="App-header">
      <img src="./img/logo.png" className="App-logo" alt="logo" /><br />
      <FormControl id="languageChoice" name="languageChoice" componentClass="select" onChange={this.updateLanguage.bind(this)} value={this.props.resourceGlobal.language} >
        {this.opcoesIdiomas()}
      </FormControl>
      <Menu onLogout={this.props.onLogout} resourceGlobal={this.props.resourceGlobal} usuarioLogado={this.props.usuarioLogado} menu={this.props.menu} />
    </header>);
  }
}


export default Header;