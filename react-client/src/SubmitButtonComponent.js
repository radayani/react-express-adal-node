import React from 'react';
// import RaisedButton from 'material-ui/RaisedButton';
// import VotedChipsComponent from './VotedChipsComponent';
// import VotedProjectsIcon from './VotedProjectsIcon';
// import VotedCardsComponent from './VotedCardsComponent';
const style = {
  margin: 15,
};
export default class SubmitButtonComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.state =
    //   {
    //     buttonCliked: false,
    //     chips: [],
    //     resetSuccess: false
    //   };
  }

  // handleChipsReset() {
  //   console.log("HANDLIND CHIPS RESET");
  //   var x = this.props.onChange();
  //   this.setState({ resetSuccess: x });
  //   console.log("is reset success: " + this.state.resetSuccess);
  // }

  // handleChipsStates() {
  //   console.log("Handling Chips States");
  //   this.props.chipsList.forEach(function (x) {
  //     console.log(x.key, x.label);
  //   });
  //   this.state.chips = this.props.chipsList.slice();
  //   this.setState({ chips: this.state.chips });
  //   this.setState({ buttonCliked: true });
  // }

  // handleVotedProjectChipsSubmit = (event) => {
  //   this.handleChipsStates();
  //   this.handleChipsReset();
  // }
  //  shouldComponentUpdate(nextProps, nextState) {
  //     console.log("should update?" + this.state.buttonCliked + " " + nextState.buttonCliked);
  //     return nextState.buttonCliked != this.state.buttonCliked;
  //   }
  render() {
    return (
      <div>

      </div>
    );
  }
}