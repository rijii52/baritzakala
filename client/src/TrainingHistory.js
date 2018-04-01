import React, { Component } from 'react';
import './TrainingHistory.css';
import { isNumber, isNull } from 'util';
import GeminiScrollbar from 'react-gemini-scrollbar';
import "gemini-scrollbar/gemini-scrollbar.css";
import Modal from 'react-modal';
import ReactEcharts from 'echarts-for-react';

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

function FormatDate (dateTicks, withDayOfWeek) {
  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  var TheDate = new Date(dateTicks);
  var formattedDate = TheDate.getDate() + " " + monthNames[TheDate.getMonth()] + " " + TheDate.getFullYear();

  var dayNames = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];
  if (withDayOfWeek)
    formattedDate += (", " + dayNames[TheDate.getDay()]);

  return formattedDate;
}

function DaysSince(baseDateTicks, targetDateTicks) {
  var baseDate = new Date(baseDateTicks);
  var baseDateOnly = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  var targetDate = new Date(targetDateTicks);
  var targetDateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  var diff = Math.round((targetDateOnly.getTime() - baseDateOnly.getTime()) / 1000 / 3600 / 24, 10);
  return diff;
}

class TrainingHistory extends Component {
    constructor (props) {
      super(props);
    
      this.state = {
        detailsIsOpen: false,
        detailsIndex: null,
        history: [],
        chartMode: 'time'
      };

      this.openDetails = this.openDetails.bind(this);
      this.afterOpenDetails = this.afterOpenDetails.bind(this);
      this.closeDetails = this.closeDetails.bind(this);
      this.switchChartMode = this.switchChartMode.bind(this);
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
    
    closeDetails (e) {
      e.preventDefault();
      this.setState({detailsIsOpen: false});
    }

    getDetailsTitleDate() {
      if (this.state.detailsIndex != null)
        return FormatDate(this.state.history[this.state.detailsIndex].TrainingDate, true);
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

    getEchartOptions() {

      if (this.state.history.length === 0)
        return ({});

      var dataRunningDistance = [];
      var dataTotalDistance = [];
      var dataMaxRunningTime = [];
      var dataTotalRunningTime = [];
      var baseDate = this.state.history[0].TrainingDate;
      this.state.history.forEach(element => {
        var days = DaysSince(baseDate, element.TrainingDate);
        dataRunningDistance.push([days,element.TotalRunningDistance]);
        dataTotalDistance.push([days,element.TrainingDistance]);
        dataMaxRunningTime.push([days,element.MaxRunningTime / 60]);
        dataTotalRunningTime.push([days,element.TotalRunningTime / 60]);
      });

      return ({
        tooltip: {
          trigger: 'axis',
          padding: 10,
          backgroundColor: 'rgba(46, 125, 50, 0.7)',
          formatter: function (params) {
           var dateVal = new Date(baseDate);
           dateVal.setDate(dateVal.getDate() + params[0].value[0]);
           var dateText = FormatDate(dateVal.getTime(), true);

            var ttText = dateText + '<br />' + params[0].seriesName + ' ' + params[0].value[1];
            if (params.length === 2)
              ttText = ttText + '<br />' + params[1].seriesName + ' ' + params[1].value[1];

            return ttText;
          },
          axisPointer: {
              animation: false
          }
        },
        legend: {
          data: this.state.chartMode === 'time' ? ['Max Running Time', 'Total Running Time'] : ['Running Distance', 'Total Distance'],
          top: 20,
          padding: 0,
          textStyle: {
              fontFamily: 'Segoe UI',
              fontSize: 14
          },
          selectedMode: 'multiple',
          x: 'center'
        },
        grid: {
          left: '7%',
          right: '5%'
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value, index) {
              var labelDate = new Date(baseDate);
              labelDate.setDate(labelDate.getDate() + value);
              return FormatDate(labelDate.getTime());
            }
          },
          max: 'dataMax'
        },
        yAxis: {
          type: 'value'
        },
        series: [{
            name: this.state.chartMode === 'time' ? 'Max Running Time' : 'Running Distance',
            type: 'line',
            data: this.state.chartMode === 'time' ? dataMaxRunningTime : dataRunningDistance
        },
        {
            name: this.state.chartMode === 'time' ? 'Total Running Time' : 'Total Distance',
            type: 'line',
            data: this.state.chartMode === 'time' ? dataTotalRunningTime : dataTotalDistance
        }]
      });
    }

    switchChartMode(e, mode) {
      e.preventDefault();
      this.setState({ chartMode: mode });
    }

    // render component
    render() {

        // fill table content
        const tableContent = this.state.history.map((element, index) =>
          <tr onClick={() => this.openDetails(index)}>
            <td>{FormatDate(element.TrainingDate)}</td>
            <td>{element.races.length}</td>
            <td>{SecondsToTimeFormat(element.MaxRunningTime)}</td>
            <td>{element.MaxRunningDistance}</td>
            <td>{SecondsToTimeFormat(element.TotalRunningTime)}</td>
            <td>{element.TotalRunningDistance}</td>
            <td>{SecondsToTimeFormat(element.TrainingTime)}</td>
            <td>{element.TrainingDistance}</td>
          </tr>
        );

        // details
        const TitleDate = this.getDetailsTitleDate();
        const trainingDetails = this.getDetails();

        // return table with static header and prepared content
        return (
          <div>
            <div className="Charts-Container">
              <div className="Chart-Switch">
                <a href="./" 
                  className={this.state.chartMode === 'time' ? "Chart-Switch-Button By-Time Active" : "Chart-Switch-Button By-Time"} 
                  onClick={(event) => this.switchChartMode(event,'time')}>Time</a>
                <a href="./" 
                  className={this.state.chartMode === 'time' ? "Chart-Switch-Button By-Distance" : "Chart-Switch-Button By-Distance Active"}
                  onClick={(event) => this.switchChartMode(event,'distance')}>Distance</a>
              </div>
              <ReactEcharts option={this.getEchartOptions()} notMerge={true} lazyUpdate={true} 
                style={{height: '100%', width: '100%'}} />
            </div>
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
                    <a href="./" onClick={(event) => this.closeDetails(event)}>Close</a>
                  </div>
            </Modal>
          </div>
        );
      }    
}

export default TrainingHistory;