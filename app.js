const express = require('express')
const hbs = require('hbs')

var app = express();

hbs.registerPartials(__dirname + '/views');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

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

app.listen(8080, () => {
    console.log('Vanguard Assult is online')
});

