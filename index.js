const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Dummy "database"
let games = [
    { id: 1, title: 'Pizza Tower', priceEuro: 19.95, genre: "platformer", artstyle: "Cartoon", onDiscount: false },
    { id: 2, title: 'FarCry 5', priceEuro: 8.99, genre: "FPS", artstyle: "Realistic", onDiscount: true },
    { id: 3, title: "No Man's Sky", priceEuro: 29.49, genre: "Survival Sandbox", artstyle: "Sci-Fi", onDiscount: true },
    { id: 4, title: "Deep Rock Galactic", priceEuro: 29.99, genre: "Cooperative FPS", artstyle: "Low-Poly", onDiscount: false }
];
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', (req, res) => {
    //res.send("Testing");
    res.render('index',
        {
            pagetitle: "Welcome to our website!"
        });
});

//http://localhost:3000/recommended
app.get('/recommended', (req, res) => {
    res.render('recommended',
        {
            pagetitle: "Our recomended games",
            desc: "Take a look at the games that we recommend!",
            games: games,
        });
});
//http://localhost:3000/allgameslist
app.get('/allgameslist', (req, res) => {
    res.json(games)

});
//http://localhost:3000/game/1
app.get('/game/:id', (req, res) => {
    const id = Number(req.params.id);
    const game = games.find(game => game.id === id);


    if (game) {
        res.json(game)
    }
    else {
        res.status(404).json({
            msg: 'Not found'
        })
    }

});

app.delete('/game/:id', (req, res) => {
    const id = Number(req.params.id);
    games = games.filter(game => game.id !== id)
    res.json(games)
})

app.post('/allgameslist', (req, res) => {
    //console.log(req.body.title);    
    if (!req.body.title || !req.body.priceEuro || typeof req.body.onDiscount != "boolean") {
        res.status(400).json({ msg: 'Missing name ,price or discount status' })
    }
    else {
        const Newid = games[games.length - 1].id + 1;

        const newgame = {
            id: Newid,
            title: req.body.title,
            priceEuro: req.body.priceEuro,
            genre: req.body.genre,
            artstyle: req.body.artstyle,
            onDiscount: req.body.onDiscount
        }
        games.push(newgame);

        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/${Newid}`;

        res.location(url);
        res.status(201).json(newgame);
    }
});

app.patch('/game/:id', (req, res) => {

    const idToUpdate = Number(req.params.id);
    const NewTitle = req.body.title;
    const newprice = req.body.priceEuro;
    const game = games.find(game => game.id === idToUpdate)
    if (game) {
        game.title = NewTitle;
        game.priceEuro = newprice;
        res.status(200).json(game);
    }
    else {
        res.status(404).json({ msg: "Resource not found" })
    }


})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening port ${PORT}`));
