const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var trainingModel = require('./models/training.js');
const path = require('path');

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

app.use('/static', express.static(path.join(__dirname+'/client/build/static')));
// app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));