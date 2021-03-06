import React, { Component } from 'react';
import './Frontend.css';
import { isNumber, isNull } from 'util';
import NumericInput from 'react-numeric-input';

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

class ListOfRaces extends Component {
  render () {

    const tableContent = this.props.races.map((element) =>
      <tr>
        <td>{SecondsToTimeFormat(element.start)}</td>
        <td>{SecondsToTimeFormat(element.stop)}</td>
        <td>{SecondsToTimeFormat(element.time)}</td>
        <td>{element.speed.toFixed(1)}</td>
        <td>{element.distance}</td>
      </tr>
    );

    return (
      <div className="RacesTableHolder">
        <table className="RacesTable">
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
            {tableContent}
            <tr>
                <td></td>
                <td></td>
                <td>{SecondsToTimeFormat(this.props.runningTime)}</td>
                <td></td>
                <td>{this.props.runningDistance}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class ActiveTraining extends Component {
  constructor (props) {
    super(props);

    this.state = {
      time: 0,
      speed: 8.6
    };

    this.startRunning = this.startRunning.bind(this);
    this.stopRunning = this.stopRunning.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
  }

  listOfRacesComponent (races, runningTime, runningDistance) {
    return <ListOfRaces races={races} runningTime={runningTime} runningDistance={runningDistance} />
  }

  startRunning (e) {
    e.preventDefault();

    let startRaceTime = 0;
    while (startRaceTime < this.props.trainingTime + 15) {
      startRaceTime += 30;
    }
    let timeAhead = startRaceTime - this.props.trainingTime;

    this.props.updateRunningStatus("starting");

    this.setState({
      start: startRaceTime,
      time: timeAhead
    });

    this.timeID = setInterval(
      () => this.raceTick(),
      1000
    );
  }

  stopRunning (e) {
    e.preventDefault();

    clearInterval(this.timeID);

    // if race was actually started then store the race, otherwise cancel it
    if (this.props.runningStatus === "running") {

        var stoptime = this.state.start + this.state.time;
        var distance = parseInt(this.state.speed * 1000 / 3600 * this.state.time, 10);

        this.props.addRace({
          start: this.state.start,
          stop: stoptime,
          time: this.state.time,
          speed: this.state.speed,
          distance: distance
        });
    }

    this.props.updateRunningStatus("walking");

    this.setState({
      time: 0
    });
  }

  raceTick () {
    if (this.props.runningStatus === "starting") {
      this.setState((prevState, props) => ({
        time: prevState.time - 1
      }));
    }
    else {
      this.setState((prevState, props) => ({
        time: prevState.time + 1
      }));
    }

    if (this.state.time === 0) {
      this.props.updateRunningStatus("running");
    }
  }

  handleSpeedChange (valueAsNumber, valueAsString) {
    this.setState({
      speed: valueAsNumber
    });
  }

  raceCtrlBlock () {
    var SpeedInputStyle = {
      input: {
        width: '134px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '32px'
      }
    };

    switch (this.props.runningStatus) {
      case "walking":
        return (
          <div className="RaceCtrlBlockHolder">
            <div className="LargeCtrlBtnHolder">
              <div className="SpeedInputStyleHolder">
                <NumericInput step={0.1} precision={1} value={this.state.speed} style={SpeedInputStyle} onChange={this.handleSpeedChange} />
              </div>
              <div className="RaceTime RaceTimeWalking">{SecondsToTimeFormat(this.state.time)}</div><br />
              <a href="./" className="MainCtrlButton GreenCtrlButton LargeCtrlButton" onClick={this.startRunning}>RUN</a>
            </div>
          </div>
        );

      case "starting":
        return (
          <div className="RaceCtrlBlockHolder">
            <div className="LargeCtrlBtnHolder">
              <div className="SpeedInputStyleHolder">
                <NumericInput disabled step={0.1} precision={1} value={this.state.speed} style={SpeedInputStyle} onChange={this.handleSpeedChange} />
              </div>
              <div className="RaceTime RaceTimeStarting">{SecondsToTimeFormat(this.state.time)}</div><br />
              <a href="./" className="MainCtrlButton GreenCtrlButton LargeCtrlButton" onClick={this.stopRunning}>STOP</a>
            </div>
          </div>          
        );

      case "running":
        return (
          <div className="RaceCtrlBlockHolder">
            <div className="LargeCtrlBtnHolder">
              <div className="SpeedInputStyleHolder">
                <NumericInput disabled step={0.1} precision={1} value={this.state.speed} style={SpeedInputStyle} onChange={this.handleSpeedChange} />
              </div>
              <div className="RaceTime RaceTimeRunning">{SecondsToTimeFormat(this.state.time)}</div><br />
              <a href="./" className="MainCtrlButton GreenCtrlButton LargeCtrlButton" onClick={this.stopRunning}>STOP</a>
            </div>
          </div>
        );

      default:
        break;
    }
  }

  render () {

    const ListOfRacesComponent = this.listOfRacesComponent(this.props.races, this.props.runningTime, this.props.runningDistance);
    const RaceCtrlBlock = this.raceCtrlBlock();

    return (
      <div className="ActiveTraining">
        {ListOfRacesComponent}
        {RaceCtrlBlock}
      </div>
    );
  }
}

class FinishedTraining extends Component {

  listOfRacesComponent (races, runningTime, runningDistance) {
    return <ListOfRaces races={races} runningTime={runningTime} runningDistance={runningDistance} />
  }

  render () {

    const ListOfRacesComponent = this.listOfRacesComponent(this.props.races, this.props.runningTime, this.props.runningDistance);
    const totalStyle = {
      fontSize:'18px'
    };
    
    return (
      <div className="FinishedTraining">
        {ListOfRacesComponent}
        <div style={totalStyle}>
          Total Training Time: {parseInt(this.props.trainingTime / 60, 10)}:{parseInt(this.props.trainingTime % 60, 10)}
        </div>
      </div>
    );
  }
}

class Frontend extends Component {
  constructor (props) {
    super(props);

    this.state = {
      status: "initial"
    };

    this.startTraining = this.startTraining.bind(this);
    this.updateRunningStatus = this.updateRunningStatus.bind(this);
    this.finishTraining = this.finishTraining.bind(this);
    this.storeTraining = this.storeTraining.bind(this);
    this.addRace = this.addRace.bind(this);
  }

  startTraining (e) {
    e.preventDefault();

    this.setState({
      status: "training",
      runningStatus: "walking",
      trainingTime: 0,
      races: [
        {
          start: 120,
          stop: 360,
          time: 180,
          speed: 8.0,
          distance: 400
        },
        {
          start: 540,
          stop: 810,
          time: 180,
          speed: 8.0,
          distance: 400
        },
        {
          start: 1020,
          stop: 1170,
          time: 180,
          speed: 8.0,
          distance: 400
        },
        {
          start: 1380,
          stop: 1500,
          time: 180,
          speed: 8.0,
          distance: 400
        },
        {
          start: 1680,
          stop: 1800,
          time: 180,
          speed: 8.0,
          distance: 400
        },
        {
          start: 2040,
          stop: 2190,
          time: 180,
          speed: 8.0,
          distance: 400
        }
      ],
      runningTime: 1050,
      runningDistance: 2333
    });

    this.timeID = setInterval(
      () => this.trainingTick(),
      1000
    );
  }

  updateRunningStatus (runningStatus) {
    this.setState ({
      runningStatus: runningStatus
    });
  }

  finishTraining (e) {
    e.preventDefault();

    if (this.state.runningStatus === "walking") {
      clearInterval(this.timeID);
      this.setState({
        status: "pending_store"
      });
    }
  }

  trainingTick () {
    this.setState((prevState, props) => ({
      trainingTime: prevState.trainingTime + 1
    }));
  }

  storeTraining (e) {
    e.preventDefault();

    this.callStoreTraining();

    this.setState({
      status: "initial"
    });
  }

  callStoreTraining = async () => {
    var Today = Date.now();
    var maxRunningTime = 0;
    var maxRunningDistance = 0;
    this.state.races.forEach(element => {
      if (element.time > maxRunningTime)
        maxRunningTime = element.time;
      if (element.time * element.speed > maxRunningDistance)
        maxRunningDistance = Math.round(element.time * element.speed * 1000 / 3600);
    });

    var stateToStore = {
      TrainingDate: Today,
      MaxRunningTime: maxRunningTime,
      MaxRunningDistance: maxRunningDistance,
      TotalRunningTime: this.state.runningTime,
      TotalRunningDistance: this.state.runningDistance,
      TrainingTime: this.state.trainingTime,
      TrainingDistance: this.state.runningDistance,  // TO BE CHANGED 
      races: this.state.races
    };

    const response = await fetch('api/storetraining', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(stateToStore)
    });
    
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
  }

  trainingButton () {
    switch(this.state.status)
    {
      case "initial":
        return (
          <div className="LargeCtrlBtnHolder">
            <a href="./" className="MainCtrlButton GreenCtrlButton LargeCtrlButton" onClick={this.startTraining}>START</a>
          </div>
        );
        
      case "training":
        if (this.state.runningStatus === "walking") {
          return  (
            <div className="SmallCtrlButtonHolder">
              <a href="./" className="MainCtrlButton SmallCtrlButton GreenCtrlButton" onClick={this.finishTraining}>FINISH</a>
            </div>
          );
          }
        else {
          return  (
            <div className="SmallCtrlButtonHolder">
              <a href="./" className="MainCtrlButton SmallCtrlButton GrayCtrlButton" disabled onClick={this.finishTraining}>FINISH</a>
            </div>
          );
        }

      case "pending_store":
        return (
          <div className="SmallCtrlButtonHolder">
            <a href="./" className="MainCtrlButton GreenCtrlButton SmallCtrlButton" onClick={this.storeTraining}>STORE</a>
          </div>
        );

      default:
        break;
    }
  }

  addRace(raceData) {
    var updatedRaces = this.state.races.slice();
    updatedRaces.push(raceData);
    var updatedRunningTime = this.state.runningTime + raceData.time;
    var updatedRunningDistance = this.state.runningDistance + raceData.distance;
    this.setState({
      races: updatedRaces,
      runningTime: updatedRunningTime,
      runningDistance: updatedRunningDistance
    });
  }

  trainingComponent (status, trainingTime, races, runningTime, runningDistance, runningStatus, updateRunningStatus, addRace) {
    switch (this.state.status)
    {
      case "training":
        return <ActiveTraining status={status} trainingTime={trainingTime} races={races} 
          runningTime={runningTime} runningDistance={runningDistance} runningStatus={this.state.runningStatus} 
          updateRunningStatus={updateRunningStatus} addRace={addRace} />

      case "pending_store":
        return <FinishedTraining trainingTime={trainingTime} races={races} runningTime={runningTime} runningDistance={runningDistance} />

      default:
        break;
    }
  }

  render () {

    const trainingComponent = this.trainingComponent(this.state.status, this.state.trainingTime, this.state.races,
      this.state.runningTime, this.state.runningDistance, this.state.runningStatus, this.updateRunningStatus, this.addRace);
    const TrainingButton = this.trainingButton();

    return (
        <div className="Frontend">
            {trainingComponent}
            {TrainingButton}
        </div>
    );
  }
}

export default Frontend;