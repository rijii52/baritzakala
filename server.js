const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/history', (req, res) => {
  res.send(
    {
      history: [
        {
          TrainingDate: '12-Mar-2018',
          MaxRunningTime: 7.0,
          TotalRunningTime: 28.0,
          TotalRunningDistance: 3733,
          TrainingTime: 50.0,
          TrainingDistance: 5612
        },
        {
          TrainingDate: '13-Mar-2018',
          MaxRunningTime: 7.0,
          TotalRunningTime: 28.0,
          TotalRunningDistance: 3733,
          TrainingTime: 50.0,
          TrainingDistance: 5613
        },
        {
          TrainingDate: '14-Mar-2018',
          MaxRunningTime: 7.0,
          TotalRunningTime: 28.0,
          TotalRunningDistance: 3733,
          TrainingTime: 50.0,
          TrainingDistance: 5614
        },
        {
          TrainingDate: '15-Mar-2018',
          MaxRunningTime: 7.0,
          TotalRunningTime: 28.0,
          TotalRunningDistance: 3733,
          TrainingTime: 50.0,
          TrainingDistance: 5615
        },
        {
          TrainingDate: '16-Mar-2018',
          MaxRunningTime: 7.0,
          TotalRunningTime: 28.0,
          TotalRunningDistance: 3733,
          TrainingTime: 50.0,
          TrainingDistance: 5616
        },
        {
          TrainingDate: '17-Mar-2018',
          MaxRunningTime: 7.0,
          TotalRunningTime: 28.0,
          TotalRunningDistance: 3733,
          TrainingTime: 50.0,
          TrainingDistance: 5617
        }
      ]
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));