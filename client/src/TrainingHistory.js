import React, { Component } from 'react';
import './TrainingHistory.css';
import { isNumber, isNull } from 'util';
import GeminiScrollbar from 'react-gemini-scrollbar';
import "gemini-scrollbar/gemini-scrollbar.css";
import Modal from 'react-modal';

function SecondsToTimeFormat(seconds) {
  if (isNull(seconds) || !isNumber(seconds))
    return "";

  var sMinutes = parseInt(seconds / 60, 10).toString();
  while (sMinutes.length < 2) {
    sMinutes = '0' + sMinutes;
  }

  var sSeconds = parseInt(seconds % 60, 10).toString();
  while (sSeconds.length < 2) {
    sSeconds = '0' + sSeconds;
  }

  return sMinutes + ":" + sSeconds;
}

class TrainingHistory extends Component {
    constructor (props) {
      super(props);
    
      this.state = {
        detailsIsOpen: false,
        detailsIndex: null,
        history: []
      };

      this.openDetails = this.openDetails.bind(this);
      this.afterOpenDetails = this.afterOpenDetails.bind(this);
      this.closeDetails = this.closeDetails.bind(this);
    }
      
    // handle DidMount event - load history from API
    componentDidMount() {
        this.callGetHistory()
          .then(res => this.setState({ history: res.history }))
          .catch(err => console.log(err));
    }

    // call GetHistory API
    callGetHistory = async () => {
        const response = await fetch('api/history');
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;    
    };

    openDetails (index) {
      this.setState({
        detailsIsOpen: true,
        detailsIndex: index
      });
    }

    afterOpenDetails () {      
    }
    
    closeDetails () {
      this.setState({detailsIsOpen: false});
    }

    getDetailsTitleDate() {
      if (this.state.detailsIndex != null)
        return this.state.history[this.state.detailsIndex].TrainingDate;
      else
        return;
    }

    getDetails () {
      if (this.state.detailsIndex != null)
      {
        const racesTableContent = this.state.history[this.state.detailsIndex].races.map((element) =>
        <tr>
          <td>{SecondsToTimeFormat(element.start)}</td>
          <td>{SecondsToTimeFormat(element.stop)}</td>
          <td>{SecondsToTimeFormat(element.time)}</td>
          <td>{element.speed.toFixed(1)}</td>
          <td>{element.distance}</td>
        </tr>
      );
          
        return (
          <div>
            <div className="Details-General-Holder">
              <table className="Details-General">
                <tr>
                  <td>Max Running Time:</td>
                  <td>{SecondsToTimeFormat(this.state.history[this.state.detailsIndex].MaxRunningTime)}</td>
                </tr>
                <tr>
                  <td>Max Running Distance:</td>
                  <td>{this.state.history[this.state.detailsIndex].MaxRunningDistance}</td>
                </tr>            
                <tr>
                  <td>Total Running Time:</td>
                  <td>{SecondsToTimeFormat(this.state.history[this.state.detailsIndex].TotalRunningTime)}</td>
                </tr>                   
                <tr>
                  <td>Total Running Distance:</td>
                  <td>{this.state.history[this.state.detailsIndex].TotalRunningDistance}</td>
                </tr>            
                <tr>
                  <td>Training Time:</td>
                  <td>{SecondsToTimeFormat(this.state.history[this.state.detailsIndex].TrainingTime)}</td>
                </tr>                   
                <tr>
                  <td>Training Distance:</td>
                  <td>{this.state.history[this.state.detailsIndex].TrainingDistance}</td>
                </tr>            
              </table>
            </div>
            <div className="Details-Races-Holder">
              <table className="Details-Races">
                <thead>
                  <tr>
                    <th>Start</th>
                    <th>Stop</th>
                    <th>Time</th>
                    <th>Speed</th>
                    <th>Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {racesTableContent}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      else
        return;
    }

    // render component
    render() {

        // fill table content
        const tableContent = this.state.history.map((element, index) =>
          <tr onClick={() => this.openDetails(index)}>
            <td>{element.TrainingDate}</td>
            <td>{element.races.length}</td>
            <td>{SecondsToTimeFormat(element.MaxRunningTime)}</td>
            <td>{element.MaxRunningDistance}</td>
            <td>{SecondsToTimeFormat(element.TotalRunningTime)}</td>
            <td>{element.TotalRunningDistance}</td>
            <td>{SecondsToTimeFormat(element.TrainingTime)}</td>
            <td>{element.TrainingDistance}</td>
          </tr>
        );

        const TitleDate = this.getDetailsTitleDate();
        const trainingDetails = this.getDetails();

        // return table with static header and prepared content
        return (
          <div>
            <div className="Charts-Container"></div>
            <div className="History-Container">
                <table className="History-table">
                    <thead>
                      <tr>
                        <th>Training Date</th>
                        <th>Races</th>
                        <th>Max Running Time</th>
                        <th>Max Running Distance</th>
                        <th>Total Running Time</th>
                        <th>Total Running Distance</th>
                        <th>Training Time</th>                
                        <th>Training Distance</th>
                      </tr>
                    </thead>
                  </table>
              <GeminiScrollbar className="Gemini-Styles" autoshow={true}>
                  <table className="History-table">
                    <tbody>
                      {tableContent}
                    </tbody>
                  </table>
              </GeminiScrollbar>
            </div>
              <Modal isOpen={this.state.detailsIsOpen} onAfterOpen={this.afterOpenDetails} onRequestClose={this.closeDetails} 
                className="Details" overlayClassName="DetailsOverlay" contentLabel="Training Details">
                  <div className="Details-Title">{TitleDate}</div>
                  {trainingDetails}
                  <div className="Details-Close-Holder">
                    <button onClick={this.closeDetails}>close</button>
                  </div>
            </Modal>
          </div>
        );
      }    
}

export default TrainingHistory;