const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var trainingModel = require('./models/training.js');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/history', (req, res) => {

  var mongoDB = 'mongodb://baritzakala:skillsand123@ds123499.mlab.com:23499/baritzakala';
  mongoose.connect(mongoDB);
  var db = mongoose.connection;

  trainingModel.find({}).sort({_id : 1}).lean().exec(function (err, trainingDocs) {
    if (err) return handleError(err);

    // reformat date
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  
    for (var i = 0; i < trainingDocs.length; i++) {
      var TheDate = new Date(trainingDocs[i].TrainingDate);
      var FormattedDate = TheDate.getDate() + " " + monthNames[TheDate.getMonth()] + " " + TheDate.getFullYear();
      trainingDocs[i].TrainingDate = FormattedDate;
    }

    res.send({
        history: trainingDocs
      });
  });
});

app.post('/api/storetraining', (req, res) => {

  console.log(req.body);

  // create document using model
  var NewTraining = new trainingModel(req.body);

  // connect db
  var mongoDB = 'mongodb://baritzakala:skillsand123@ds123499.mlab.com:23499/baritzakala';
  mongoose.connect(mongoDB);
  var db = mongoose.connection;

  NewTraining.save(function (err) {
    if (err) return handleError(err);
    // saved!
    res.send({
      result: 'ok'
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));