var express = require('express');
var hbs = require('hbs');
var port = process.env.PORT || 8080;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static('assets'));


app.get('/', (request, response) => {
    response.render('landing.hbs', {
        title: 'Vanguard Assault',
    });
});
app.get('/login', (request, response) => {
    response.render('login.hbs', {
        title: 'Login',
    });
});

app.get('/signup', (request, response) => {
    response.render('signup.hbs', {
        title: 'signup',
    });
});

app.get('/user', (request, response) => {
    response.render('main_user_page.hbs', {
        title: 'user',
    });
});

app.get('/deckbuild', (request, response) => {
    response.render('deckbuild.hbs', {
        title: 'deckbuild',
    });
});


app.listen(port, () => {
    console.log('Vanguard Assault is online')
});

