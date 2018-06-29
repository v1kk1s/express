import express from 'express';
import fs from 'fs';

const port = 3000;
const app = express();

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

app.get('/', (req, res) => {
  let buffer = '';

  users.forEach((user) => {
    buffer += `<a href='/${user.username}'>${user.name.full}</a> </br>`;
  });

  res.send(buffer);
});

app.get(/big.*/, (req, res, next) => {
  console.log('Biiig!');
  next();
});

app.get('/:username', (req, res) => {
  const username = req.params.username;
  res.send(`Page of ${username}! RRRRR!`);
});

app.get('/intro', (req, res) => {
  res.send('Intro page');
});

const server = app.listen(port, () => {
  console.log(`Express app started on port ${port}`);
});