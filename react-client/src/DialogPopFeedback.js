import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
const styles = {
    block: {
        maxWidth: 250,
        textAlign: 'left'
    },
    checkbox: {
        marginBottom: 16,
        textAlign: 'left',
        paddingLeft: 15,
        paddingRight: 15
    },
    margins: {
        marginTop: 8,
        width: 300,
        padding: 5,
        display: 'inline-block',
        marginBottom: 20
    }
}

export default class DialogPopFeedback extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feedbackText: 'this is it',
            feedbackSaved: false
        }
    }

    handleRequestClose() {
        this.setState({ snackbarOpen: false }, function () {
            this.handleClose();
        });
    }

    handleText(event, newValue) {
        this.setState({ feedbackText: newValue });
    }

    handleClose() {
        if (this.props.feedbackOpen)
            this.props.onCloseCallback();
        else
            this.props.history.goBack();
    }

    saveFeedbackOnButtonClick() {
        this.setState({ feedbackSaved: true, snackbarOpen: true }, function () {
        });
        // post back the feedback to DB
    }

    render() {
        if (this.props.feedbackOpen) {
            const voterActions = [
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onTouchTap={this.handleClose.bind(this)}
                />,
                <FlatButton
                    label="Save"
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={this.saveFeedbackOnButtonClick.bind(this)}
                />,
            ]
            return (
                <Dialog
                    title="Feedback"
                    actions={voterActions}
                    modal={true}
                    open={this.props.feedbackOpen}
                    autoScrollBodyContent={true}
                    onRequestClose={this.handleClose.bind(this)}>
                    <div style={styles.block}>
                        <TextField
                            hintText={this.props.voterSelectedProj}
                            floatingLabelText="Message For The Team"
                            multiLine={true}
                            rows={2}
                            onChange={this.handleText.bind(this)} />
                        <Checkbox
                            label="Ship It"
                            style={styles.checkbox}
                            labelPosition="left" />

                        <Checkbox
                            label="Super Creative"
                            style={styles.checkbox}
                            labelPosition="left" />

                        <Checkbox
                            label="Inspired Me"
                            style={styles.checkbox}
                            labelPosition="left" />

                        <Checkbox
                            label="Learnt Something"
                            style={styles.checkbox}
                            labelPosition="left" />
                    </div>
                    <br />
                    {this.state.feedbackSaved
                        &&
                        <Snackbar
                            style={{ width: 210 }}
                            open={this.state.snackbarOpen}
                            message="Saved Successfully!"
                            autoHideDuration={1000}
                            onRequestClose={this.handleRequestClose.bind(this)} />}
                </Dialog>
            );
        }
        return (
            <Paper zDepth={1} style={styles.margins}>
                <div style={{ marginTop: 10 }}><b>Feedback</b></div>

                <TextField
                    hintText={this.props.match.params.projId}
                    floatingLabelText="Message for the Team"
                    floatingLabelStyle={{ alignSelf: 'flexStart', display: 'flex' }}
                    multiLine={true}
                    rows={3}
                    style={{ marginBottom: 20, marginTop: 0 }}
                    onChange={this.handleText.bind(this)} />

                <Checkbox
                    label="Ship It"
                    style={styles.checkbox}
                    labelPosition="left" />

                <Checkbox
                    label="Super Creative"
                    style={styles.checkbox}
                    labelPosition="left" />

                <Checkbox
                    label="Inspired Me"
                    style={styles.checkbox}
                    labelPosition="left" />

                <Checkbox
                    label="Learnt Something"
                    style={styles.checkbox}
                    labelPosition="left" />
                <br />
                <RaisedButton
                    label="Save"
                    primary={true}

                    onTouchTap={this.saveFeedbackOnButtonClick.bind(this)}
                />
                {this.state.feedbackSaved
                    &&
                    <Snackbar
                        style={{ width: 210 }}
                        open={this.state.snackbarOpen}
                        message="Saved Successfully!"
                        autoHideDuration={1000}
                        onRequestClose={this.handleRequestClose.bind(this)} />
                }
            </Paper>
        );
    }
}