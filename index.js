import express from 'express';
import fs from 'fs';
import consolidate from 'consolidate';
import bodyParser from 'body-parser';
import path from 'path';

const port = 3000;
const app = express();
const engines = consolidate;

// returns all users from users file
// const users = [];
// fs.readFile('./data/users.json', { encoding: 'utf8' }, (err, data) => {
//   if (err) return;

//   JSON.parse(data).forEach((user) => {
//     const name = user.name.first || '';
//     const nameUppercased = name.charAt(0).toUpperCase() + name.slice(1);
//     const lastName = user.name.last || '';
//     const lastnameUppercased = lastName.charAt(0).toUpperCase() + lastName.slice(1);
//     user.name.full = `${nameUppercased} ${lastnameUppercased}`;
//     users.push(user);
//   });
// });

const getAllUsers = () => new Promise((res, rej) => {
  const users = []
  fs.readdir('data/users', function (err, files) {
    files.forEach(function (file) {
      fs.readFile(path.join(__dirname, 'data/users', file), {encoding: 'utf8'}, function (err, data) {
        const user = JSON.parse(data);
        const name = user.name.first || '';
        const nameUppercased = name.charAt(0).toUpperCase() + name.slice(1);
        const lastName = user.name.last || '';
        const lastnameUppercased = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        user.name.full = `${nameUppercased} ${lastnameUppercased}`;
        users.push(user);
        if (users.length === files.length) res(users);
      })
    })
  });
});

const getUser = (username) => new Promise((res, rej) => fs.readFile(`./data/users/${username}.json`, { encoding: 'utf8' }, (err, data) => {
  if(err) rej(err);
  else res(JSON.parse(data));
}));

const getUserFilePath = (username) => path.join(__dirname, 'data/users', username) + '.json';

const saveUser = (username, data) => {
  const filePath = getUserFilePath(username);
  fs.unlinkSync(filePath); // delete the file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {encoding: 'utf8'});
};

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profilePics', express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.render('index', { users });
});

app.get(/big.*/, (req, res, next) => {
  console.log('Biiig!');
  next();
});

app.get('/:username', async (req, res) => {
  const username = req.params.username;
  const user = await getUser(username);
  res.render('user', {
    user,
    address: user.location,
    });
});

app.put('/:username', async (req, res) => {
  const username = req.params.username;
  const user = await getUser(username);
  user.location = req.body;
  saveUser(username, user);
  res.end();
});

app.delete('/:username', async (req, res) => {
  const username = req.params.username;
  const filePath = getUserFilePath(username);
  fs.unlinkSync(filePath); // delete the file
  res.sendStatus(200);
});

app.get('/intro', (req, res) => {
  res.send('Intro page');
});

const server = app.listen(port, () => {
  console.log(`Express app started on port ${port}`);
});