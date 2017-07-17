import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { NavLink } from "react-router-dom"
import Paper from 'material-ui/Paper';

const style = {
  button: {
    margin: 10,
     height: 60,
     width:150
  },
  paper: {
    marginTop: 10,
    width:250,
    padding: 5,
    textAlign: 'center',
    display: 'inline-block',
    marginBottom: 20
  },
  innerPaper: {
    width:230,
    padding: 10,
    textAlign: 'center',
    display: 'inline-block'
  }
};

class UserModeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userMode: ''
    };
  }

  handleVoterButtonClick() {
    localStorage.setItem("userMode", 'voter');
  }

  handlePresenterButtonClick() {
    localStorage.setItem("userMode", 'presenter');
  }

  render() {
    return (  
            <div>
        <Paper zDepth={3} style={style.paper}>

          {localStorage.userMode === 'voter'
            &&
            <Paper zdepth={1} style={style.innerPaper}>
              You are currently in <br /><b>Voter Mode</b>. <br /><br />You can change view mode <br /> by going to the menu <br />on top right <br />selecting <b>Presenter Mode</b>
            </Paper>
          }

          {localStorage.userMode === 'presenter'
            &&
            <Paper zdepth={1} style={style.innerPaper}>
              You are currently in <br /><b>Presenter Mode</b>. <br /><br /> In order to vote for other's projects, go to <br /> menu icon on top right <br /> select <b>Voter Mode</b>
            </Paper>
          }
          <br />
          <NavLink to={`${this.props.match.url}/voter/mainVotePage`}>
            <RaisedButton label="Voter" primary={true} style={style.button} onTouchTap={this.handleVoterButtonClick} />
          </NavLink>
          <br />
          <br />
          <NavLink to={`${this.props.match.url}/presenter/myProjects`} >
            <RaisedButton label="Presenter" secondary={true} style={style.button} onTouchTap={this.handlePresenterButtonClick} />
          </NavLink>  
        </Paper>
      </div>
    );
  }
}

export default UserModeComponent;