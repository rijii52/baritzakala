import React, { Component } from 'react';
import './TrainingHistory.css';
import { isNumber, isNull } from 'util';

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
    // init history state object
    state = {
        history: []
      };
      
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

    // render component
    render() {

        // fill table content
        const tableContent = this.state.history.map((element) =>
          <tr>
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
    
        // return table with static header and prepared content
        return (
            <div className="History-block">
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
                <tbody>
                  {tableContent}
                </tbody>
              </table>
            </div>
        );
      }    
}

export default TrainingHistory;