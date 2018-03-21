var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var TrainingSchema = new Schema({
    TrainingDate: Date,
    MaxRunningTime: Number,
    MaxRunningDistance: Number,
    TotalRunningTime: Number,
    TotalRunningDistance: Number,
    TrainingTime: Number,
    TrainingDistance: Number,
    races: [{
        start: Number,
        stop: Number,
        time: Number,
        speed: Number,
        distance: Number      
    }]
});

module.exports = mongoose.model('TrainingModel', TrainingSchema, 'trainings');