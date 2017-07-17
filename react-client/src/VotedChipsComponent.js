// import React from 'react';
// import Chip from 'material-ui/Chip';
// import SubmitButtonComponent from './SubmitButtonComponent';

// export default class VotedChipsComponent extends React.Component {
//     constructor(props) {
//         super(props);
//         console.log("votedChipsConstructor : " + this.props.name);
//         this.chipCount = 0;
//         this.state = { chipData: [] };
//         this.styles = {
//             chip: {
//                 margin: 4,
//             },
//             wrapper: {
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 float: 'center',
//             },
//         };
//     }

//     componentWillMount() {
//         console.log("mouting voted chips component");
//         this.chipCount += 1;
//         console.log("component received props on mounting" + this.props.name + " " + this.chipCount + " " + this.state.chipData);
//         this.state.chipData.push({ key: this.chipCount, label: this.props.name, desc: this.props.desc });
//         this.setState({ chipData: this.state.chipData });
//     }

//     //     componentWillUnMount(){
//     //     console.log("chip component unmounting..");
//     //   }

//     handleDeleteAll() {
//         console.log("DELETE ALL CHIPS");
//         var x = [];
//         this.setState({ chipData: x })
//         return true;
//     }

//     componentWillReceiveProps(newProps) {
//         this.chipCount += 1;
//         console.log("component received props" + this.props.name + " " + this.chipCount + " " + this.state.chipData + " " + newProps.name);
//         this.state.chipData.push({ key: this.chipCount, label: newProps.name, desc: newProps.desc });
//         this.setState({ chipData: this.state.chipData });
//     }

//     // shouldComponentUpdate(nextProps, nextState) {
//     //     console.log("should update chip state?" + nextProps +" " +nextState);
//     //     return nextProps.chipData != this.props.chipData;
//     // }
//     handleRequestDelete = (key) => {
//         this.chipData = this.state.chipData;
//         const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
//         this.chipData.splice(chipToDelete, 1);
//         this.setState({ chipData: this.chipData });
//     };

//     renderChip(data) {
//         console.log(data.key + "-------" + data.label);
//         return (
//             <Chip
//                 key={data.key}
//                 onRequestDelete={() => this.handleRequestDelete(data.key)}
//                 style={this.styles.chip}>
//                 {data.label}
//             </Chip>
//         );
//     }

//     render() {
//         console.log("rendering..");
        
//         if (!this.state.chipData) {
//             return <div> Loading voted chips..
//             <SubmitButtonComponent name={this.state.chipData} />
//             </div>
//         }

//         return (
//             <div>
//                 <div style={this.styles.wrapper}>
//                     {this.state.chipData && this.state.chipData.map(this.renderChip, this)}
//                 </div>
//                 <SubmitButtonComponent chipsList={this.state.chipData} onChange={this.handleDeleteAll.bind(this)} />
//             </div>
//         );
//     }
// }