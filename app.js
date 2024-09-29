const express = require('express');
const app = express();
const axios = require('axios');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.render('index');
  });

  app.post('/get-joke', async (req, res) => {
    const name = req.body.name;
    try {
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
        params: {
          format: 'json',
          contains: name,
        },
      });
      res.render('joke', { joke: response.data });
    } catch (error) {
      res.send('An error occurred. Please try again.');
    }
  });