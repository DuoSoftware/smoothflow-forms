
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.CLIENT_URL = `http://localhost:${process.env.PORT}`;
} 
else{
  process.env.CLIENT_URL = "http://smoothflow.herokuapp.com";

}