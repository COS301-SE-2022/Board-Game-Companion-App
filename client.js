const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/apps/client'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/apps/client/index.html'));
});

app.listen(process.env.PORT || 8080);

//The code for this server was comes from the https://itnext.io/how-to-deploy-angular-application-to-heroku-1d56e09c5147 website