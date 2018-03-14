import React, { Component } from 'react';
import './App.css';
import TrainingHistory from './TrainingHistory';
import Frontend from './Frontend';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter> 
          <Switch> 
            <Route exact path="/" component={TrainingHistory} />
            <Route exact path="/frontend" component={Frontend} />
            <Redirect from='*' to='/' /> 
            </Switch> 
        </BrowserRouter>
      </div>
    );
  }
}

export default App;