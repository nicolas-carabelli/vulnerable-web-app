// Packages we are using
var express = require('express'),
    app = express(),
    request = require('request'),
    async = require('async'),
    url = require('url'),
    path = require('path'),
    exphbs  = require('express-handlebars'),
    subdomain = require('express-subdomain'),
    crypto = require('crypto'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    session = require('express-session');

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de express-session
app.use(session({
    name: 'sid',
    secret: 'supersecretsecur3passw0rd',
    cookie: {
        httpOnly: false,
        maxAge: 60000 * 60 * 24
    },
    resave: false, // Evita que la sesión se guarde en cada solicitud
    saveUninitialized: true // Guarda sesiones nuevas
}));

// This is a global variable that only exists to demonstrate stored XSS
var global_var = "This is a greeting to all users that view this page! Change it in the box below.";

// Any url beginning with /static is assumed to be a static file,
// and will be served from the static directory
app.use('/static', express.static(__dirname + '/static'));

// This is our rendering engine
// It can be used to demonstrate forms of XSS
app.engine('.html', exphbs({ extname: '.html', partialsDir: __dirname + '/views', defaultLayout: "head" }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.html');

// Run the server
app.listen(process.env.PORT || 8080);

// Routes
app.get("/", function(req, res) {
    return res.render("main", {});
});

// ... (resto de tus rutas)

app.post("/csrf_protected_form", function(req, res) {
    if (!req.body.recoveryemail || !req.body.csrf_token)
        return res.status(400).send("Missing one or more parameters");
    return res.status(200).send("Successfully Saved");
});
