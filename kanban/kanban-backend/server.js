const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/kanban', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const columnSchema = new mongoose.Schema({
  name: String,
  tasks: [taskSchema],
});

const Column = mongoose.model('Column', columnSchema);

app.get('/tasks', async (req, res) => {
  try {
    const columns = await Column.find();
    res.json(columns);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
