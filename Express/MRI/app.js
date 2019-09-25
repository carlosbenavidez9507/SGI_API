var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const admin = require('firebase-admin');

var app = express();

// Conexión a Firebase
let serviceAccount = require('../firebase_key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore(); // Acesso a Firestore

app.get('/incidentes', function(req, res){
    db.collection("incidentes").get().
    then(snapshot => {
      snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());   
        res.json(doc.data());        
      });
    })
    .catch(error => { 
      console.log(error);
    });

    /*res.json({
      hello: 'world'
    });*/
});

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({
    message: res.local.message,
    error: res.locals.error
  });
});

module.exports = app;