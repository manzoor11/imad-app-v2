var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user: 'manzoor11',
    database: 'manzoor11',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: 'db-manzoor11-74299'
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var counter = 0;
app.get('/counter', function(req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

function createTemplate(data) 
{
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;

        var htmlTemplate = `
            <html>
            <head>
                <title>
                    ${title}
                </title>  
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                   <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div class="container">
                    <div>
                        <a href="/">Home</a>
                    </div>
                    <hr/>
                    <h3>
                        ${heading}
                    </h3>
                    <div>
                        ${date.toDateString()}
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
            </body>
        </html> 
        `;
        return htmlTemplate;
}    

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt) {
    //how do we create hash?
    var hashed = crypto.pbkdf25sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.post('/create-user', function(req,res) {
    //username, password
    //JSON
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err,result) {
        if (err) {
           res.status(500).send(err.toString());
        } else {
            res.send('User succesfully created: ' + userename);
        }
    });
});   

app.post('/login', function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * from "user" WHERE username = $1', [username], function(err,result) {
        if (err) {
           res.status(500).send(err.toString());
        } else {
            if(result.rows.length === 0) {
                res.send('username/password is invalid');
            } else {
                //match the password
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt); //creare a hash based on the password
                if(hashedPassword === dbString) {
                    res.send('Credentials correct');
                } else {
                    res.send(403).send('username/password is invalid');
                }
            }
        }
    });
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    //make a select request
    //return response with a result
    pool.query('SELECT * FROM test', function (err, result){
        if(err){
            res.status(500).send(err.toString());
        } else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/articles/:articleName', function(req, res){
    // articleName == article-one
    //articles[articleName] = {} content object for article one
   
   // SELECT *FROM article WHERE title = article-one
   pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err,result){
       if (err) {
           res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0){
                res.status(404).send('Article not found');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        } 
    });
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var names=[];
app.get('/submit-name/:name', function(req, res) {  // URL: /submit-name?name=manz if we give query instead of params
 // get the name 
 var name = req.params.name;
 
 names.push(name);
 // JSON : java s
 res.send(JSON.stringify(names));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
