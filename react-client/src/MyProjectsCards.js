// NOT USING THIS FILE FOR NOW BUT WILL SEE THE BUG IN IT LATER..
import React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { cyan100, pinkA200, lightBlack } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import RaisedButton from 'material-ui/RaisedButton';
import DialogPopFeedback from './DialogPopFeedback';
import DialogPopVote from './DialogPopVote';
import { NavLink } from "react-router-dom"

const styles = {
  voterButton: {
    backgroundColor: cyan100,
    marginRight: 30,
  },
  presenterButton: {
    backgroundColor: pinkA200,

  },
  presenterButtonRegister: {
    registered: {
      float: 'right'
    },
    notregistered: {
      backgroundColor: lightBlack,
      float: 'right'
    }
  },

};

export default class MyProjectsCards extends React.Component {
  constructor(props) {
    super(props);
    console.log(" URL " + this.props.match.params.modeId);
    this.state = {
      votedProjects: [],
      registeredProjects: [],
      feedbackOpen: false,
      votepageOpen: false,
      voterSelectedProj: '',
      presenterSelectedProj: '',
      projects: {
        voter: [
          { key: "BloodConnect", label: "Blood Connect", desc: "fnocidsnvoifsdnvoi" },
          { key: "BloodForSure", label: "Blood For Sure", desc: "dskvjfdszovfsd" },
          { key: "DonateBlood", label: "Donate Blood", desc: "dsgfdjpvodmp" },
          { key: "ProvideBlood", label: "Provide Blood", desc: "saicnxsoincoisdc" },
          { key: "SureCan", label: "Sure Can", desc: "sdifbcosdinco" },
          { key: "ConnectPeople", label: "Connect People", desc: "eivndoifvn" },
          { key: "PeopleFinder", label: "People Finder", desc: "wefcmedcv" },
          { key: "LovePeople", label: "Love People", desc: "wfceiov" }
        ],
        presenter: [
          { key: "BloodConnect", label: "Blood Connect", desc: "fnocidsnvoifsdnvoi", registered: false },
          { key: "BloodForSure", label: "Blood For Sure", desc: "dskvjfdszovfsd", registered: true },
          { key: "DonateBlood", label: "Donate Blood", desc: "dsgfdjpvodmp", registered: false },
          { key: "ProvideBlood", label: "Provide Blood", desc: "saicnxsoincoisdc", registered: true },
          { key: "SureCan", label: "Sure Can", desc: "sdifbcosdinco", registered: true },
          { key: "ConnectPeople", label: "Connect People", desc: "eivndoifvn", registered: false },
          { key: "PeopleFinder", label: "People Finder", desc: "wefcmedcv", registered: false },
          { key: "LovePeople", label: "Love People", desc: "wfceiov", registered: false }
        ]

      }
    };
  }

  updateDimensions() {
    if (window.innerWidth < 400) {
      this.setState({ deviceWindow: 'narrowWindow' }, function () { console.log("device window set, rerender...") });
    }
    else {
      this.setState({ deviceWindow: 'broadWindow' }, function () { console.log("device window set, rerender...") });
    }
  }
  componentWillUnmount() {
    console.log("unmouting Projects List page.............." + this.props.match.params.modeId);
  }

  componentWillReceiveProps(nextProps) {
    console.log("comp received PROPS: " + this.props.match.params.modeId + " nextprops:" + nextProps.match.params.modeId)

    if (this.props.match.params.modeId !== nextProps.match.params.modeId) {

      if (nextProps.match.params.modeId == 'voter') {
        console.log("VOTED PROJS LIST API CALLED")
        fetch('/votedProjects')
          .then(res => res.json())
          .then(votedProjects => this.setState({ votedProjects }, function () { console.log(votedProjects + " render now please..") }));
      } else if (nextProps.match.params.modeId === 'presenter') {
        console.log("REGISTERED PROJS LIST API CALLED")
        fetch('/registeredProjects')
          .then(res => res.json())
          .then(registeredProjects => this.setState({ registeredProjects }, function () { console.log(registeredProjects + "render now please..") }));
      }
    }
  }

  componentWillUpdate(nextProps) {
    console.log("component will udpate " + this.props.match.params.modeId + " nextprops:" + nextProps.match.params.modeId);
  }

    shouldComponentUpdate(){
      return true;
  }
  componentDidMount() {
    
    // localStorage.setItem("userMode", this.props.match.params.modeId);
    console.log("THIS !!!!!  project list did mount" + localStorage.userMode);
if (localStorage.userMode === 'voter') {
      console.log("VOTED PROJS LIST API CALLED")
      fetch('/votedProjects')
        .then(res => res.json())
        .then(votedProjects => this.setState({ votedProjects }, function() {console.log("votedProjects set.. should be able to render the change now")}));
    } else if (localStorage.userMode === 'presenter') {
      console.log("REGISTERD PROJS LIST API CALLED")
      fetch('/registeredProjects')
        .then(res => res.json())
        .then(registeredProjects => this.setState({ registeredProjects }, function(){console.log("registeredProjects set.. should be able to render the change now")}));
    }

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

  }

  componentWillMount() {
    console.log("mounting projects list page................ " + this.props.match.params.modeId)
    localStorage.setItem("userMode", this.props.match.params.modeId);
    

    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }


  handleRegisteration() {
    console.log("handled registeration");
  }


  handleClose = () => {
    if (localStorage.userMode === 'voter')
      this.setState({ feedbackOpen: false });
    else if (localStorage.userMode === 'presenter')
      this.setState({ votepageOpen: false })

  };

  handleOpen = (proj) => {
    if (localStorage.userMode === 'voter')
      this.setState({ feedbackOpen: true, voterSelectedProj: proj });
    else if (localStorage.userMode === 'presenter')
      this.setState({ votepageOpen: true, presenterSelectedProj: proj })
  };
  componentDidUpdate(){
    console.log("component did update");
  }
  render() {
    {console.log("RENDERED");}
    // {
    //   console.log("voted projects");
    //   this.state.votedProjects.map(function (proj) {
    //     console.log(proj.key + " " + proj.label + " " + proj.desc);
    //   });
    // }

    // {
    //   console.log("registered projects")
    //   this.state.registeredProjects.map(function (proj) {
    //     console.log(proj.key + " " + proj.label + " " + proj.desc);
    //   });
    // }

    if (localStorage.userMode === 'voter') {
      return (
        <div className="default">
          {
            this.state.votedProjects.map(function (elem, i) {
              return (
                <Card key={i}>
                  <CardHeader

                    title={elem.label}
                    subtitle="// Fetch subtitle from DB if any for this project"
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardText expandable={true}>
                    {elem.desc}
                    {
                      // TODO fetch the details of the project from the DB and display here in 
                    }
                  </CardText>
                  <CardActions>
                    <a target="_blank" href="https://garagehackbox.azurewebsites.net/hackathons/oneweek/projects/tile" rel="noopener noreferrer"  >
                      <FlatButton label="Continue Reading..." style={styles.voterButton} />
                    </a>
                    {this.state.deviceWindow === 'narrowWindow' &&
                      <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/voter/myProjects/${elem.key}/feedback?${this.state.deviceWindow}`} >
                        <RaisedButton label="Feedback" />
                      </NavLink>
                    }
                    {this.state.deviceWindow === 'broadWindow' &&

                      <RaisedButton label="Feedback" onTouchTap={this.handleOpen.bind(this, elem.label)} />

                    }



                  
                  </CardActions>
                </Card>
              );
            }, this)}

          {this.state.feedbackOpen
            &&
            <DialogPopFeedback voterSelectedProj={this.state.voterSelectedProj} feedbackOpen={this.state.feedbackOpen} onCloseCallback={this.handleClose.bind(this)} isItPhoneWindow={this.state.phoneWindow} />}


        </div>
      );
    }
    else if (localStorage.userMode === 'presenter') {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>

          <div className="default voterButton presenterButton">

            {this.state.registeredProjects.map(function (elem, i) {
              return (
                <Card key={i}>
                  <CardHeader
                    title={elem.label}
                    subtitle="// Fetch from DB if any sub heading for the project"
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardText expandable={true}>
                    {elem.desc}
                    {// TODO fetch the details of the project from the DB and display here in 
                    }
                  </CardText>
                  <CardActions>
                    {this.state.deviceWindow === 'narrowWindow' &&
                      <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/presenter/myProjects/${elem.key}/votePage?${this.state.deviceWindow}`} >
                        <FlatButton label="Take Vote" style={styles.presenterButton} />
                      </NavLink>
                    }
                    {this.state.deviceWindow == 'broadWindow' &&
                      <FlatButton label="Take Vote" style={styles.presenterButton} onTouchTap={this.handleOpen.bind(this, elem.label)} />

                    }
                    <FlatButton label={elem.registered ? "Already Registered" : "Register"} style={elem.registered ? styles.presenterButtonRegister.registered : styles.presenterButtonRegister.notregistered} disabled={elem.registered ? true : false} onTouchTap={this.handleRegisteration} />
                  </CardActions>
                </Card>

              );
            }, this)}

            {this.state.votepageOpen && <DialogPopVote presenterSelectedProj={this.state.presenterSelectedProj} votepageOpen={this.state.votepageOpen} onCloseCallback={this.handleClose.bind(this)} isItPhoneWindow={this.state.phoneWindow} />}

          </div>
        </MuiThemeProvider>

      );
    }
  }
}