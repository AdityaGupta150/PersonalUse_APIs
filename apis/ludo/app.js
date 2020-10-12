const { random } = require('underscore');
const app = require('express')();

//routes
const moveRouter = require('./routes/move');

const PORT = process.env.PORT || 3000;

app.get('/roll', (req, res) => {
    let n = random(1,6);
    let arr = []
    arr.push(n);
    while ( n==6 ) {
        n = random(1, 6);
        arr.push(n);
    }
    // @todo - Remove 3 consecutive sixes if any

    res.json({
        'roll': arr
    });
});

app.use('/move', moveRouter);

module.exports = app;
