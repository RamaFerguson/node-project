const express = require('express');
const port = process.env.PORT || 8000;

const app = express();

app.get("/", function (request, result) {
    result.send(JSON.stringify({ Hello: "World"}));
});

app.listen(port, function () {
    console.log(`Vanguard Assault app listening on port 8000!`);
});