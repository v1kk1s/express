import express from 'express';
import fs from 'fs';
import consolidate from 'consolidate';

const port = 3000;
const app = express();
const engines = consolidate;

const users = [];
fs.readFile('./data/users.json', { encoding: 'utf8' }, (err, data) => {
  if (err) return;

  JSON.parse(data).forEach((user) => {
    const name = user.name.first || '';
    const nameUppercased = name.charAt(0).toUpperCase() + name.slice(1);
    const lastName = user.name.last || '';
    const lastnameUppercased = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    user.name.full = `${nameUppercased} ${lastnameUppercased}`;
    users.push(user);
  });
});

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profilePics', express.static('images'));

app.get('/', (req, res) => {
  res.render('index', { users });
});

app.get(/big.*/, (req, res, next) => {
  console.log('Biiig!');
  next();
});

app.get('/:username', (req, res) => {
  const username = req.params.username;
  const user = users.find((user) => user.username === username) || {};
  res.render('user', { user });
});

app.get('/intro', (req, res) => {
  res.send('Intro page');
});

const server = app.listen(port, () => {
  console.log(`Express app started on port ${port}`);
});