
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class LoginPage extends React.Component {

    constructor(props){
        super(props);
    }

    handleButtonClick(){
        fetch('/login') 
        .then(respose => respose.json());
    }
    render(){
        return(
            <RaisedButton label="login" onTouchTap={this.handleButtonClick.bind(this)}/>
        );
    }
}