import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import { lightBlack, cyan50 } from 'material-ui/styles/colors';
import { NavLink } from "react-router-dom"
// import CopyToClipboard from 'react-copy-to-clipboard';
import shortid from 'shortid';
const style = {
    paper: {
        marginTop: 8,
        width: 250,

        padding: 5,
        textAlign: 'center',
        display: 'inline-block',
        marginBottom: 20
    },
    button: {
        backgroundColor: cyan50,
        marginBottom: 20,
        height: 60,
    },
    innerPaper: {
        width: 230,
        padding: 10,
        textAlign: 'center',
        display: 'inline-block'
    },
    pinSpan: {
        padding: 10,
        textAlign: 'center',
        display: 'inline-block'
    },
    msgPaper: {
        width: 230,
        marginTop: 20,
        padding: 8
        ,
        textAlign: 'center',
        display: 'inline-block'
    }
};
       

export default class GenerateMyPinComponent extends React.Component {
    constructor(props) {

        super(props);
        console.log(this.props.pin);

        console.log("PIN generation comp costructor called" + localStorage);
        this.state = {
            // copied: false,
            myPIN: '--',
            open: false
        };



        if (localStorage.alias !== this.props.match.params.alias) {
            localStorage.setItem("alias", this.props.match.params.alias);
        }
    }

    componentWillMount() {
        console.log(this.state.myPIN);
         
    }
    componentDidMount() {
        localStorage.setItem("alias", this.props.match.params.alias);
        console.log(this.state.myPIN);
        
        

    }
    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    // onCopy() {
    //     this.setState({ copied: true });
    // }

    handleButtonClick() {
        var x = shortid();
        // LIMITATION WITH SHORTID NPM PACKAGE - THIS PIN CANT GO IN URL ??????
        // https://www.npmjs.com/package/shortid HERE IT SAYS IT IS URL FRIENDLY - BUT I GOT A '/' IN THE ID - dangerous 
        x = x.replace('/', 'x');
        localStorage.setItem("myPIN", x);

        fetch(`/savePin?alias=${localStorage.alias}&UniquePin=${x}`, {

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

            })
            .then(this.setState({ myPIN: localStorage.myPIN }))
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            })




        this.setState({ myPIN: localStorage.myPIN });
    }
    render() {
        {console.log("render..")}
        return (
            <div>
                <Paper style={style.paper} zDepth={3} >
                    <Paper zDepth={1} style={style.innerPaper}>
                        To cast your votes <br /> <b>directly at the booths</b> <br />during Science Fair.
                    </Paper>
                    <br />
                    <br />

                     {!localStorage.myPIN
                        &&
                        <RaisedButton label="Generate My PIN" primary={true} style={style.button} onTouchTap={this.handleButtonClick.bind(this)} />
                    }

                    {localStorage.myPIN &&
                         <div>
                            <RaisedButton
                                label="Generate My PIN"
                                disabled={true}
                                primary={true}
                                style={style.button}
                                onTouchTap={this.handleButtonClick.bind(this)} />

                            <Snackbar
                                open={this.state.open}
                                message="Successfully generated your unique PIN!"
                                autoHideDuration={1000}
                                onRequestClose={this.handleRequestClose}
                                style={{ background: lightBlack }} />
                            <br />

                            <span style={style.pinSpan}><b>{localStorage.myPIN}</b></span>
                            <Paper zDepth={1} style={style.msgPaper}>
                                You'll need this <b>Voter's Code</b>!<br /> <br />No need to copy, you'll find your code in the menu on top left when in Voter Mode
                            </Paper>

                        </div>
                    }
                </Paper>
                <br />
                
                  {
                    localStorage.myPIN != null
                    &&
                    <NavLink to={`${this.props.match.url}/${localStorage.myPIN}/userMode`}>
                        <RaisedButton label="Continue" primary={true} />
                    </NavLink>}
            </div>
        );
    
  
    }
}


