var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const { RSA_NO_PADDING } = require('constants');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');
//main page and content page
app.get(['/topic', '/topic/:id'], function(req, res){
    var id = req.params.id;
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        
        if(id){
            //id값이 있을 때
            if(id==='new'){
                res.render('new', {topics: files});
            }
            else if(id==='update'){
                res.render('update', {topics: files, title:req.query.title});
            }
            else{
                fs.readFile('data/'+id, 'utf8', function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500).send('No Such File');
                    }
                        res.render('view', {title:id, description:data, topics:files});
                });
            }
        }
        else{
             //id값이 없을 때
            res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for server', home:1});
        }

       
    });
});
//making a new file and updating a file
app.post(['/topic/new', '/topic/update'], function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, function(err){
        if(err){
            res.status(500).send('Internal Server Error!')
        }
        res.redirect('/topic');
    });
}); 
//deleting file
app.post('/topic/delete', function(req, res){
    var title = req.body.title;
    fs.unlink('data/'+title, function(err){
        if(err){
            console.log(err)
            res.status(500).send('Internal Server Error!')
        }
        res.redirect('/topic');
    });
});

app.listen(3000, function(){
    console.log('Connected, 3000 port!');
});