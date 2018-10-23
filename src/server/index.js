
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const config = require('config');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const home = require('./routes/home');
const about = require('./routes/about');
const stories = require('./routes/stories');
const users = require('./routes/users'); // register route
const auth = require('./routes/auth'); // login route
const logout = require('./routes/logout'); // logout route
const loggedIn = require('./middleware/logged');

const app = express();

const {truncate, stripTags, editIcon, editDeleteIcon, formateDate, username} = require('../../helpers/hbs');

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/storyBooks', { useNewUrlParser: true })
  .then(() => console.log('connected to mongodb'))
  .catch(err =>  console.error('could not connect to monogodb'));

// middlewares
  // handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
      editIcon: editIcon,
      editDeleteIcon,
      truncate,
      stripTags,
      formateDate,
      username
    },
    defaultLayout: 'main'
  }));

app.set('view engine', 'handlebars');
  // body parser middlewar
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  // static middleware
app.use('/static', express.static(path.join(__dirname, '../', '../', './dist')));
console.log(path.resolve(__dirname, '../../'));
  // method override middleware
app.use(methodOverride('_method'));

  // check logged middleware
app.use('/', loggedIn);

  // middleware routes
app.use('/', home);
app.use('/about', about);
app.use('/api/stories', stories);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/logout', logout);


if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listing on port ${port} ...`))