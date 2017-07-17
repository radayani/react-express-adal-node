import React from 'react';
import Drawer from 'material-ui/Drawer';
import { NavLink } from "react-router-dom";
import FaCopy from 'react-icons/lib/fa/copy';
import FaBars from 'react-icons/lib/fa/bars';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { lightBlack, cyan700, pinkA200, fullWhite } from 'material-ui/styles/colors';
import CopyToClipboard from 'react-copy-to-clipboard';
import Notifications, { notify } from 'react-notify-toast';
const menuItems = [
  "Vote",
  "My Projects",
  "Register For SF"
]


export default class VotedProjectsIcon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      // menuItemClicked: false,
      copied: false,
    };
  }
  onCopy() {
    this.setState({ copied: true }, function () {
      let myColor = { background: fullWhite, text: cyan700 };
      notify.show('Copied!', "custom", 1000, myColor);
    });
  }
  handleToggle = () => this.setState({ open: !this.state.open });

  // handleClose = () => this.setState({ open: false });

  // handleItemClick(item, e) {
  //   console.log("entered" + item);
  //   this.setState({ menuItemClicked: true }, function () {
  //     this.handleClose();
  //   });

  // }

  render() {
    if (localStorage.userMode === 'voter') {
      return (
        <div>

          <FaBars
            width={70}
            height={30}
            onTouchTap={this.handleToggle}
            style={{ color: fullWhite, marginTop: -15 }}

          />

          <Drawer
            docked={false}
            width={250}
            open={this.state.open}
            onRequestChange={(open) => this.setState({ open })}
          >
            <AppBar
              title={localStorage.alias.toUpperCase()}
              iconElementLeft={<IconButton style={{ width: 50, height: 50, marginTop: -10 }}><Avatar color={cyan700} backgroundColor={fullWhite}>{localStorage.alias[0].toUpperCase()}</Avatar></IconButton>}
              style={{ height: 110, padding: 30 }} >
              <CopyToClipboard text={localStorage.myPIN} onCopy={this.onCopy.bind(this)}>

                <span style={{ marginTop: 35, color: 'white', position: 'absolute', marginLeft: 72, fontSize: 13 }}><br />
                  {localStorage.myPIN}
                  <FaCopy style={{ marginLeft: 7, padding: 0, marginTop: -2 }} />
                  <Notifications />
                </span>
              </CopyToClipboard>
            </AppBar>

            <List className="alignLeft" >
              {localStorage.userMode === 'voter' &&
                <div>
                  <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/${localStorage.userMode}/mainVotePage`} onTouchTap={this.handleToggle.bind(this, "Vote")} style={{ textDecoration: 'none' }}>
                    <ListItem
                      primaryText="Vote" />
                  </NavLink>

                  <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/${localStorage.userMode}/myProjects`} onTouchTap={this.handleToggle.bind(this, "My Voted Projects")} style={{ textDecoration: 'none' }}>
                    <ListItem primaryText="My Voted Projects" />
                  </NavLink>



                  <NavLink exact to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/${localStorage.userMode}/myProjects/register`} onTouchTap={this.handleToggle.bind(this, menuItems[3])} style={{ textDecoration: 'none' }} >
                    <ListItem primaryText="Register for Science Fair" />
                  </NavLink>
                </div>
              }
              <a target="_blank" href="https://garagehackbox.azurewebsites.net/hackathons/oneweek/projects/tile" rel='noreferrer noopener' style={{ textDecoration: 'none' }}>
                <ListItem
                  primaryText="Go To Hackbox"
                />
              </a>
              <Divider />

              <Subheader style={{ color: lightBlack }}>Disabled Features</Subheader>

              <ListItem
                primaryText="Recommendations"
                secondaryText="Projects as per your interests "
              />
            </List>
          </Drawer>
        </div>
      );
    }
    else {
      return (
        <div>


          <FaBars
            width={70}
            height={30}
            onTouchTap={this.handleToggle}
            style={{ color: fullWhite, padding: 10 }}

          />
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>

            <Drawer
              docked={false}
              width={250}
              open={this.state.open}
              onRequestChange={(open) => this.setState({ open })}
            >
              <AppBar title={localStorage.alias.toUpperCase()} titleStyle={{ color: fullWhite }} iconElementLeft={<IconButton style={{ width: 50, height: 50, marginTop: -10 }}><Avatar color={pinkA200} backgroundColor={fullWhite}  >{localStorage.alias[0].toUpperCase()}</Avatar></IconButton>} style={{ height: 110, padding: 30, backgroundColor: '#FF4081', }} />

              <List className="alignLeft" >
                {localStorage.userMode === 'presenter' &&
                  <div>
                    <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/${localStorage.userMode}/myProjects`} onTouchTap={this.handleToggle.bind(this, "My Registered Projects")} style={{ textDecoration: 'none' }}>
                      <ListItem
                        primaryText="My Projects" />
                    </NavLink>

                  </div>
                }
                <a target="_blank" href="https://garagehackbox.azurewebsites.net/hackathons/oneweek/projects/tile" rel='noreferrer noopener' style={{ textDecoration: 'none' }}>
                  <ListItem
                    primaryText="Go To Hackbox"
                  />
                </a>
                <Divider />

                <Subheader style={{ color: lightBlack }}>Disabled Features</Subheader>

                <ListItem
                  primaryText="Recommendations"
                  secondaryText="Projects as per your interests "
                />
              </List>
            </Drawer>
          </MuiThemeProvider>
        </div>
      );
    }
  }
}


