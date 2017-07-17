import React from 'react';
import Badge from 'material-ui/Badge';
import VotedProjectsIcon from './VotedProjectsIcon';

export default class BadgeOnVoteIcon extends React.Component {

    // write function to call the API which gets the count of voted projects for which no feedback has been provided by that alias. Inside render, based on this count, if 0 don't render the badge, directly render the VOtedProjectsIcon, if more, then show 
    
    render() {
            if(localStorage.getItem("userMode") === 'voter') {
        return (
            <Badge
                badgeContent={0}
                primary={true}
                
                badgeStyle={{ top: 0, right: 35, position: 'absolute' }}>

                <VotedProjectsIcon />

            </Badge>
                );}
        else if (localStorage.getItem("userMode") === 'presenter')
            return <VotedProjectsIcon />
    }
}
