import React from 'react';
import AppBar from 'material-ui/AppBar';
import BadgeOnVoteIcon from './BadgeOnVoteIcon';
import { darkBlack } from 'material-ui/styles/colors';
import VerticalMenu from './VerticalMenu';

const style = {
    paddingTop: 15,
    marginTop: 0,
    backgroundColor: darkBlack,
    height: 80,
    paddingLeft: 0
}
export default class AppBarComp extends React.Component {
    render() {
        if (localStorage.myPIN != null && localStorage.userMode != null && localStorage.alias != null) {
            return (
                <AppBar
                    style={style}
                    title="Science Fair Voting"
                    iconElementRight={<VerticalMenu />}
                    iconElementLeft={<BadgeOnVoteIcon />} />
            );
        }
        return (
            <AppBar
                style={style}
                title="Science Fair Voting"
                showMenuIconButton={false} />
        );
    }
}