const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = 9000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect("mongodb+srv://kien2005kiensn:kiensn123@cluster0.mvink.mongodb.net/TreeShop?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB daket noi ")).catch(err => console.error("MongoDB connection failed:", err));

const treeSchema = new mongoose.Schema({
    treename: { type: String, required: true },
    description: { type: String, required: true },
    image: String
});

const Tree = mongoose.model('TreeCollection', treeSchema);

app.get('/', async (req, res) => {
    try {


        const trees = await Tree.find();
        res.render('index', { trees });

    } catch (error) {
        res.status(500).send("Failed to load data!");
    }
});

app.get('/about', (req, res) => res.render('about'));

app.post('/add', async (req, res) => {
    try {
        const { treename, description, image } = req.body;

        if (!treename || !description) return res.status(400).send("Name and description required!");
        await new Tree({ treename, description, image }).save();
        res.redirect('/');
    } catch (error) {

        res.status(500).send("Error adding tree!");
    }
});

app.post('/reset', async (req, res) => {
    try {
        await Tree.deleteMany({});
        res.redirect('/');
    } catch (error) {

        res.status(500).send("Reset failed!");
    }
});

app.post('/delete/:id', async (req, res) => {
    try {
        await Tree.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {


        console.error(error);
        res.status(500).send("Delete failed!");
    }
});

app.get('/update/:id', async (req, res) => {
    try {
        const tree = await Tree.findById(req.params.id);
        res.render('update', { tree });
    } catch (error) {
        console.error(error);

        res.status(500).send("Tree not found!");
    }
});

app.post('/update/:id', async (req, res) => {
    try {
        await Tree.findByIdAndUpdate(req.params.id, {
            treename: req.body.treename,
            description: req.body.description,
            image: req.body.image

        });
        res.redirect('/');
    } catch (error) {

        console.error(error);
        res.status(500).send("Update failed!");


    }
});

app.listen(port, () => console.log(`Server live at http://localhost:${port}`));