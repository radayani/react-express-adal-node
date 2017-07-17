import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import SearchFilterComponent from './SearchFilterComponent';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import { pinkA200, redA700, fullWhite } from 'material-ui/styles/colors';

const projects = [
   
];

const styles = {
    block: {
        maxWidth: 250,
        textAlign: 'left'
    },

    margins: {
        margin: 10,
        verticalAlign: true,
        width: 300,
        paddingRight: 100,
        padding: 5,
        marginBottom: 0,
        display: 'inline-block',
        incompleteDetails: false,
    }
}
export default class DialogPopVote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            voteSaved: false,
            snackbarOpen: false,
            invalidProjectSelected: false,
            alreadyVoted: false,
        };
    }

    handleRequestClose() {
        this.setState({ snackbarOpen: false, incompleteDetails: false, });
    }

    handleVoteButton() {
        this.setState({ voteSaved: true, snackbarOpen: true, incompleteDetails: true, });
        // CALL API TO SAVE THIS VOTE
    }
    handleSearchUpdate(searchText, dataSource, params) {
        this.setState({ searchedText: searchText });
    }

    handleClose() {
        if (this.props.votepageOpen)
            this.props.onCloseCallback();
        else
            this.props.history.goBack();
    }

    handleSelectForVotedProject = (chosenRequest, index) => {

        // check if already voted for this searched project
        // Call GET_MyVotedProjects
        // if(myvotedProjects.contains(chosenProject)){
        // this.setState({alreadyVoted:true}, function{
        // console.log("Already voted for this project!");
        // })
        // }

        console.log("chosen: " + chosenRequest, "...index: ", index);
        this.setState({ chosenProject: chosenRequest });
    }

    render() {
        if (this.props.votepageOpen) {
            const presenterActions = [
                <div>
                    <FlatButton
                        label="Close"
                        secondary={true}
                        onTouchTap={this.handleClose.bind(this)}
                    />
                    <FlatButton
                        label="Vote"
                        secondary={true}
                        keyboardFocused={true}
                        onTouchTap={this.handleVoteButton.bind(this)}
                    />
                </div>
            ];

            return (
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
                    <Dialog
                        title={this.props.presenterSelectedProj}
                        actions={presenterActions}
                        modal={true}
                        open={this.props.votepageOpen}
                        autoScrollBodyContent={false}
                        onRequestClose={this.handleClose.bind(this)}>

                         <div className='newline'>
                            <TextField

                                floatingLabelFocusStyle={{ color: pinkA200 }}
                                underlineFocusStyle={{ borderColor: pinkA200 }}
                                disabled={false}
                                id="alias-field"
                                floatingLabelText="Alias"
                                style={{ margin: 2 }} />

                            <TextField
                                floatingLabelFocusStyle={{ color: pinkA200 }}
                                underlineFocusStyle={{ borderColor: pinkA200 }}
                                disabled={false}
                                id="pin-field"
                                floatingLabelText="Your PIN"
                                style={{ margin: 2 }} />

                            <AutoComplete
                                onNewRequest={this.handleSelectForVotedProject.bind(this)}
                                floatingLabelText="Project Name"
                                filter={AutoComplete.caseInsensitiveFilter}
                                searchText={this.props.presenterSelectedProj}             // FETCH PROJECT NAME FROM PROJECT ID
                                onUpdateInput={this.handleSearchUpdate.bind(this)}
                                dataSource={projects}
                                maxSearchResults={10}
                                style={{ margin: 2 }}
                                textFieldStyle={{ margin: 2 }}
                                underlineFocusStyle={{ borderColor: pinkA200 }}
                                floatingLabelFocusStyle={{ color: pinkA200 }}
                            />
                            </div>

                        {this.state.voteSaved
                            &&
                            <Snackbar
                                style={{ width: 210 }}
                                open={this.state.snackbarOpen}
                                message="Voted Saved Successfully"
                                autoHideDuration={500}
                                onRequestClose={this.handleRequestClose.bind(this)} />}
                    </Dialog>
                </MuiThemeProvider>
            );
        }
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
                <Paper zDepth={1} style={styles.margins}>
                    <div style={{ marginTop: 10 }}><b>Vote</b>

                        <div className='newline'>
                            <TextField

                                floatingLabelFocusStyle={{ color: pinkA200 }}
                                underlineFocusStyle={{ borderColor: pinkA200 }}
                                disabled={false}
                                id="alias-field"
                                floatingLabelText="Alias"
                                style={{ margin: 2 }} />

                            <TextField
                                floatingLabelFocusStyle={{ color: pinkA200 }}
                                underlineFocusStyle={{ borderColor: pinkA200 }}
                                disabled={false}
                                id="pin-field"
                                floatingLabelText="Your PIN"
                                style={{ margin: 2 }} />

                            <AutoComplete
                                onNewRequest={this.handleSelectForVotedProject.bind(this)}
                                floatingLabelText="Project Name"
                                filter={AutoComplete.caseInsensitiveFilter}
                                searchText={this.props.match.params.projId}             // FETCH PROJECT NAME FROM PROJECT ID
                                onUpdateInput={this.handleSearchUpdate.bind(this)}
                                dataSource={projects}
                                maxSearchResults={10}
                                style={{ margin: 2 }}
                                textFieldStyle={{ margin: 2 }}
                                underlineFocusStyle={{ borderColor: pinkA200 }}
                                floatingLabelFocusStyle={{ color: pinkA200 }}
                            />

                            <div className='sameline' style={{ marginTop: 30 }}>

                                <FlatButton
                                    label="Close"
                                    secondary={true}
                                    onTouchTap={this.handleClose.bind(this)} />

                                <FlatButton
                                    label="Vote"
                                    secondary={true}
                                    keyboardFocused={true}
                                    onTouchTap={this.handleVoteButton.bind(this)} />

                            </div>

                            {(this.state.voteSaved) &&
                                <Snackbar
                                    open={this.state.snackbarOpen}
                                    message={"Successfully Saved Your Vote!"}
                                    bodyStyle={{ backgroundColor: pinkA200 }}
                                    contentStyle={{ color: fullWhite }}

                                    autoHideDuration={2000}
                                    onRequestClose={this.handleRequestClose.bind(this)} />}

                            {this.state.invalidProjectSelected &&
                                <Snackbar
                                    open={this.state.snackbarOpen}
                                    message={"Not a Valid Project!"}
                                    autoHideDuration={2000}
                                    bodyStyle={{ backgroundColor: redA700 }}
                                    contentStyle={{ color: fullWhite }}
                                    onRequestClose={this.handleRequestClose.bind(this)} />}
                        </div>
                    </div>
                </Paper>
            </MuiThemeProvider>
        );
    }
}
