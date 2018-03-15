import React, { Component } from 'react';
import './Frontend.css';

class ActiveTraining extends Component {
  constructor (props) {
    super(props);

    this.state = {
      status: "walking"
    };
  }

  render () {

    return (
      <div className="ActiveTraining">
        ACTIVE TRAINING
        <div>Status is {this.props.status}</div>
        <div>Training time {this.props.trainingTime} seconds</div>
      </div>
    );
  }
}

class FinishedTraining extends Component {
  render () {
    return (
      <div className="FinishedTraining">FINISHED TRAINING</div>
    );
  }
}

class Frontend extends Component {
  constructor (props) {
    super(props);

    this.state = {
      status: "initial",
      trainingTime: 0
    };

    this.startTraining = this.startTraining.bind(this);
    this.finishTraining = this.finishTraining.bind(this);
    this.storeTraining = this.storeTraining.bind(this);
  }

  startTraining (e) {
    e.preventDefault();

    this.setState({
      status: "training",
      trainingTime: 0,
      races: []
    });

    this.timeID = setInterval(
      () => this.tick(),
      1000
    );
  }

  finishTraining (e) {
    e.preventDefault();

    clearInterval(this.timeID);
    this.setState({
      status: "pending_store"
    });
  }

  tick () {
    this.setState((prevState, props) => ({
      trainingTime: prevState.trainingTime + 1
    }));
  }

  storeTraining (e) {
    e.preventDefault();

    this.setState({
      status: "initial"
    });
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
        return  (
          <div className="SmallCtrlButtonHolder">
            <a href="./" className="MainCtrlButton GreenCtrlButton SmallCtrlButton" onClick={this.finishTraining}>FINISH</a>
          </div>
        );

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

  trainingCoponent (status, trainingTime) {
    switch (this.state.status)
    {
      case "training":
        return <ActiveTraining status={status} trainingTime={trainingTime} />

      case "pending_store":
        return <FinishedTraining />

      default:
        break;
    }
  }

  render () {

    const TrainingCoponent = this.trainingCoponent(this.state.status, this.state.trainingTime);
    const TrainingButton = this.trainingButton();

    return (
        <div className="Frontend">
            {TrainingCoponent}
            {TrainingButton}
        </div>
    );
  }
}

export default Frontend;