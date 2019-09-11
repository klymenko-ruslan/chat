var express = require("express");
var app = express();
// app.use(express.static('dist/turbo-metadata-ui2/'));
// app.get('*', (req, res) => {
//   res.render('dist/turbo-metadata-ui2/index.html');
// });
// app.listen(9001, '127.0.0.1')

app.use(express.static(__dirname + '/dist/chat-frontend/'));
// Heroku port
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/dist/chat-frontend/index.html')
});
app.listen(4200);
