var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'manzoor11',
    database: 'manzoor11',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.'db-manzoor11-74299'
}
var app = express();
app.use(morgan('combined'));

var counter = 0;
app.get('/counter', function(req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

var articles = {
                 'article-one': {
                    title: 'Article | Manzoor',
                    heading: 'Article One',
                    date: 'sep 30, 2016',
                    content: `  
                                <p>
                                    This is my content for my first article.This is my content for my first article.This is my content for my first article. 
                                </p>
                                <p>
                                    This is my content for my first article.This is my content for my first article.
                                </p>
                                <p>
                                    This is my content for my first article.
                                </p> `
                },
                 'article-two': {
                    title: 'Article Two | Manzoor',
                    heading: 'Article Two',
                    date: 'sep 30, 2016',
                    content: `  
                                <p>
                                    This is my content for my first article.This is my content for my first article.This is my content for my first article. 
                                </p>
                                <p>
                                    This is my content for my first article.This is my content for my first article.
                                </p>
                                <p>
                                    This is my content for my first article.
                                </p> `
                },
                 'article-three' : {
                    title: 'Article Three | Manzoor',
                    heading: 'Article Three',
                    date: 'sep 30, 2016',
                    content: `  
                                <p>
                                    This is my content for my first article.This is my content for my first article.This is my content for my first article. 
                                </p>
                                <p>
                                    This is my content for my first article.This is my content for my first article.
                                </p>
                                <p>
                                    This is my content for my first article.
                                </p> `
                }
};

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
                        ${date}
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

var pool = new Pool(config)
app.get('/test-db', function (req, res) {
    //make a select request
    //return response with a result
    pool.query('SELECT * FROM test', function (err, result){
        if(err){
            res.status(500).send(err.toString());
        } else{
            res.send(JSON.stringify(result));
        }
    });
});

app.get(':/articleName', function(req, res)
{    // articleName = article-one
    //articles[articleName] = {} content object for article one
   var articleName =req.params.articleName;
    res.send(createTemplate(articles[articleName]));  
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
