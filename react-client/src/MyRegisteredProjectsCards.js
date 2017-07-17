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

export default class MyRegisteredProjectsCards extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem("userMode", "presenter");
    this.state = {
      registeredProjects: [],
      votepageOpen: false,
      presenterSelectedProj: '',

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
    console.log("unmouting Projects List page.............." + this.props.match.url);
  }

  componentWillReceiveProps(nextProps) {
    console.log("comp received PROPS: " + this.props.match.url + " nextprops:" + nextProps.match.url)

    if (this.props.match.url !== nextProps.match.url && localStorage.userMode === 'presenter') {
      console.log("REGISTERED PROJS LIST API CALLED")
      fetch(`/getRegisteredProjects?alias=${localStorage.alias}`)
        .then(res => res.json())
        .then(registeredProjects => this.setState({ registeredProjects }, function () { console.log(registeredProjects + "render now please..") }));
    }
  }

  componentWillUpdate(nextProps) {

    console.log("component will udpate " + this.props.match.url + " nextprops:" + nextProps.match.url);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    console.log("THIS !!!!!  project list did mount" + localStorage.userMode);
    if (localStorage.userMode === 'presenter') {
      console.log("REGISTERD PROJS LIST API CALLED")
      fetch(`/getRegisteredProjects?alias=${localStorage.alias}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(res => res.json())
        .then(registeredProjects => this.setState({ registeredProjects }, function () { console.log("registeredProjects set.. should be able to render the change now") }));
    }
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillMount() {
    console.log("mounting projects list page................ " + this.props.match.url)
    localStorage.setItem("userMode", "presenter");
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }


  handleRegisteration() {
    console.log("handled registeration");
  }

  handleClose = () => {
    this.setState({ votepageOpen: false })
  };

  handleOpen = (proj) => {
    this.setState({ votepageOpen: true,  presenterSelectedProj: proj })
  };

  // componentDidUpdate() {
  //   console.log("component did update");
  // }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="default voterButton presenterButton">
          {this.state.registeredProjects.map(function (elem, i) {
            { console.log(elem) }
            return (

              <Card key={i}>
                <CardHeader
                  title={elem.title}
                  subtitle={elem.tagline}
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText expandable={true}>
                  {elem.description}
                </CardText>
                <CardActions>
                  {console.log(`/${localStorage.alias}/${localStorage.myPIN}/userMode/presenter/myProjects/${elem.project_id}/votePage?${this.state.deviceWindow}`)}
                  {this.state.deviceWindow === 'narrowWindow' &&
                    <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/presenter/myProjects/${elem.project_id}/votePage?${this.state.deviceWindow}`} >
                      <FlatButton label="Take Vote" style={styles.presenterButton} projTitle={elem.title}/>
                    </NavLink>
                  }
                  {this.state.deviceWindow == 'broadWindow' &&
                 
                    <FlatButton label="Take Vote" style={styles.presenterButton} onTouchTap={this.handleOpen.bind(this, elem.title)}  />
                 
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