const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('success');
  })
  .catch(() => {
    console.log('fail');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '648aed8568a6271074016768',
  };

  next();
});

app.use('/users', require('./routes/usersRoutes'));
app.use('/cards', require('./routes/cardsRoutes'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
