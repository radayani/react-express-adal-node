import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan50, redA700 } from 'material-ui/styles/colors';
import { darkBlack } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';

const style = {
  margin: 15,
  button: {
    backgroundColor: cyan50,
    colors: darkBlack,
    marginRight: 55,
    padding: 0,
    disabled: {
      marginRight: 48
    }
  }
};

var projs = [];
var projDesc = null;
const dataSourceConfig = {
  text: 'title',
  value: 'id',
};
// const projects = [
//   {title: 'Blood Connect is a big title to accommodate', id: '1'},
//   {title: 'Blood For Sure', id: '2'},
//   {title: 'Donate Blood', id: '3'},
//   {title: 'Provide Blood', id: '4'},
//   {title: 'Sure Can', id: '5'},
//   {title: 'Connect People', id: '6'},
//   {title: 'People Finder', id: '7'},
//   {title: 'Love people', id: '8'},

// ];

// const projects =


//  [
//   'Blood Connect is a big title to accommodate',
//   'Blood For Sure',
//   'Donate Blood',
//   'Provide Blood',
//   'Sure Can',
//   'Connect People',
//   'People Finder',
//   'Love people',
// ];

export default class SearchFilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenProject: undefined,
      chosenProjectId: null,
      //using global variable instead
      chosenProjectDescription: null,
      voteSaved: false,
      snackbarOpen: false,
      dialogOpen: false,
      searchedText: null,
      matchedPojects: [{ title: '', id: '' }],
      invalidProjectSelected: false,
      alreadyVoted: false,
      projects: [
        // { title: 'Blood Connect is a big title to accommodate', id: '1' },
        // { title: 'Blood For Sure', id: '2' },
        // { title: 'Donate Blood', id: '3' },
        // { title: 'Provide Blood', id: '4' },
        // { title: 'Sure Can', id: '5' },
        // { title: 'Connect People', id: '6' },
        // { title: 'People Finder', id: '7' },
        // { title: 'Love people', id: '8' },

      ]
    };
    console.log(localStorage.userMode);
   
    if(localStorage.userMode !== 'presenter') 
      localStorage.userMode = this.props.match.params.modeId;

    console.log("constructor for searchfiltercomponent " + this.state.chosenProject, this.state.chosenProjectId + localStorage.userMode);
  }

  handleOpen = () => {

    console.log(projDesc);

    this.setState({ dialogOpen: true });


    ;
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  componentWillUnmount() {
    console.log("unmounting Voter vote page ............ " + this.props.match.params.modeId);
  }
  componentWillReceiveProps() {
    console.log("component will receive props");
  }

  handleSelectForVotedProject = (chosenRequest, index) => {

    // check if already voted for this searched project
    // Call GET_MyVotedProjects
    // if(myvotedProjects.contains(chosenProject)){
    // this.setState({alreadyVoted:true}, function{
    // console.log("Already voted for this project!");
    // })
    // }



    console.log("chosen: " + chosenRequest.title, "...index: ", index);
    this.setState({ chosenProject: chosenRequest.title, chosenProjectId: chosenRequest.id }, function () {

      fetch(`/projectDescription?id=${this.state.chosenProjectId}`, {

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        }
      })
        .then(function (response) {

          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response  
          response.json()
            .then(function (data) {
              console.log(data);
              projDesc = data;
              console.log(projDesc);
            });
        })
        .then(this.setState({ chosenProjectDescription: projDesc }))
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        })


    });
  }
  handleRequestClose = () => {
    this.setState({
      snackbarOpen: false,
      invalidProjectSelected: false,
      alreadyVoted: false
    });
  };

  handleVoteButton = (x) => {
    console.log(this.state.searchedText + this.state.chosenProject);
    if (this.state.searchedText === this.state.chosenProject) {


      fetch(`/castVote?id=${this.state.chosenProjectId}&alias=${localStorage.alias}`, {

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        }
      })
        .then(function (response) {

          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }


          // Examine the text in the response  
          // response.json()
          // .then(function (data) {
          //   console.log(data);  
          //   projs=data;
          //   console.log(projs);
          // });
        }
        )
        .then(this.setState({ successfullySavedVote: true }))
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });


      this.setState({ chosenProject: undefined, chosenProjectId: null, voteSaved: true, snackbarOpen: true, searchedText: '', chosenProjectDescription: null }, function () {
        if (x === "fromDialog")
          this.handleClose();
        projDesc = null;

      });
    }
    else {

      this.setState({ chosenProject: undefined, chosenProjectId: null, invalidProjectSelected: true, snackbarOpen: true, searchedText: '', chosenProjectDescription: null }, function () {
        console.log("Please select a valid project");
        projDesc = null;
      })
    }
    // CALL API TO SAVE THIS VOTE
  }

  handleSearchUpdate(searchText, dataSource, params) {
    console.log(searchText);

    console.log(dataSource);
    // this.setState({ searchedText: searchText, projects:this.state.projects });

    if (searchText.length > 2) {
      fetch(`/fetchProjects?filter=${searchText}`, {

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        }
      })
        .then(function (response) {

          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response  
          response.json()
            .then(function (data) {
              console.log(data);
              projs = data;
              console.log(projs);
            });
        }, this.setState({ projects: projs })
        )
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });

    }
    // .then(function(res){
    //   this.setState({projects: res.json().then(function(data){console.log(data)})});
    // })
    this.setState({ searchedText: searchText }, function () { console.log("searched updated to:" + this.state.searchedText) });


  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Vote"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleVoteButton.bind(this, "fromDialog")}
      />,
    ];

    return (
      <div className='newline'>
        <TextField

          disabled={true}
          id="alias-field"
          floatingLabelText={localStorage.alias}
          style={{ margin: 2 }}
        />
        <TextField

          disabled={true}
          id="pin-field"
          floatingLabelText={localStorage.myPIN}
          style={{ margin: 2 }}
        />

        <AutoComplete
          onNewRequest={this.handleSelectForVotedProject.bind(this)}
          floatingLabelText={"Search Project Name"}
          filter={AutoComplete.caseInsensitiveFilter}
          searchText={this.state.searchedText}
          onUpdateInput={this.handleSearchUpdate.bind(this)}
          // dataSource={this.state.matchedPojects}
          dataSource={this.state.projects}
          dataSourceConfig={dataSourceConfig}
          maxSearchResults={10}
          style={{ margin: 2 }}
          textFieldStyle={{ margin: 2 }}
        />

        <div className='sameline'>

          {(this.state.chosenProjectId != null) ?
            <FlatButton label="Details..." style={style.button} onTouchTap={this.handleOpen.bind(this)} /> : <FlatButton label="Details..." style={style.button.disabled} disabled={true} />
          }
          {localStorage.userMode === 'voter'
            &&
            <RaisedButton label="Vote" primary={true} style={style} onTouchTap={this.handleVoteButton.bind(this)} />
          }
        </div>

        <Dialog
          title={this.state.chosenProject}
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}>

          {projDesc}

        </Dialog>
        {(this.state.voteSaved && !this.state.alreadyVoted) &&
          <Snackbar
            open={this.state.snackbarOpen}
            message={"Successfully Saved Your Vote!"}
            autoHideDuration={2000}
            onRequestClose={this.handleRequestClose} />}

        {this.state.invalidProjectSelected &&
          <Snackbar
            open={this.state.snackbarOpen}
            message={"Not a Valid Project!"}
            autoHideDuration={2000}
            bodyStyle={{ backgroundColor: redA700 }}
            onRequestClose={this.handleRequestClose} />}
        {this.state.alreadyVoted &&
          <Snackbar
            open={this.state.snackbarOpen}
            message={"Already Voted For This One!"}
            autoHideDuration={2000}
            bodyStyle={{ backgroundColor: redA700 }}
            onRequestClose={this.handleRequestClose} />}

      </div>
    );
  }
}