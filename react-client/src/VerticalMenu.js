import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {fullWhite } from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import { NavLink } from "react-router-dom";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

export default class VerticalMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            // menuItemClicked: false
        }
    }
    handleNavLinkClick() {
        this.setState({ open: !this.state.open }, function () {
            switch (localStorage.userMode) {
                case 'voter':
                    localStorage.setItem("userMode", 'presenter');
                    break;
                case 'presenter':
                    localStorage.setItem("userMode", 'voter');
                    break;
                default: break;
            }
        })


    }
    handleOnRequestChange = (value) => {
        this.setState({
            open: value,
        });
    }
    openIconButtonClick() {
        this.setState({ open: true });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={localStorage.userMode === 'presenter' ? getMuiTheme(darkBaseTheme) : getMuiTheme(lightBaseTheme)}>
                <div>
                    <IconMenu
                        open={this.state.open}
                        iconStyle={{ color: fullWhite }}
                        iconButtonElement={
                            <IconButton onTouchTap={this.openIconButtonClick.bind(this)}  ><MoreVertIcon /></IconButton>
                        }
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        onRequestChange={this.handleOnRequestChange.bind(this)}
                    >   
                        <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/presenter/myProjects`} style={{ textDecoration: 'none' }} onTouchTap={this.handleNavLinkClick.bind(this)}>
                            {(localStorage.userMode === 'voter') &&
                                <MenuItem value="1" primaryText="Presenter Mode" style={{ color: '#ff1493', textColor: '#ff1493' }} />
                            }
                        </NavLink>

                        <NavLink to={`/${localStorage.alias}/${localStorage.myPIN}/userMode/voter/mainVotePage`} style={{ textDecoration: 'none' }} onTouchTap={this.handleNavLinkClick.bind(this)} >
                            {localStorage.userMode === 'presenter' &&
                                <MenuItem value="2" primaryText="Voter Mode"  /> 
                            }
                        </NavLink>
                        <Divider />
                        <MenuItem value="3" primaryText="Logout" />
                    </IconMenu>
                </div>
            </MuiThemeProvider>
        );
    }
}