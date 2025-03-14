const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = 9000;

// const Tree = require('./models/Tree');

// Kết nối MongoDB
mongoose.connect("mongodb+srv://kien2005kiensn:kiensn123@cluster0.mvink.mongodb.net/TreeShop?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công!"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Thiết lập EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Định nghĩa Schema và Model MongoDB
const treeSchema = new mongoose.Schema({
    treename: { type: String, required: true },
    description: { type: String, required: true },
    image: String
});
const Tree = mongoose.model('TreeCollection', treeSchema);

// Trang chính hiển thị danh sách cây
app.get('/', async (req, res) => {
    try {
        const trees = await Tree.find();
        res.render('index', { trees });
    } catch (error) {
        res.status(500).send("Lỗi khi tải dữ liệu!");
    }
});

// Trang "About Me"
app.get('/about', (req, res) => {
    res.render('about');
});

// API thêm cây vào MongoDB
app.post('/add', async (req, res) => {
    try {
        const { treename, description, image } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!treename || !description) {
            return res.status(400).send("Tên cây và mô tả không được để trống!");
        }

        // Lưu vào MongoDB
        const newTree = new Tree({ treename, description, image });
        await newTree.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Lỗi khi thêm cây!");
    }
});

// API Xóa tất cả cây (Reset)
app.post('/reset', async (req, res) => {
    try {
        await Tree.deleteMany({});
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Lỗi khi reset dữ liệu!");
    }
});

app.post('/delete/:id', async (req, res) => {
    try {
        await Tree.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error("Lỗi xóa cây:", error);
        res.status(500).send("Lỗi khi xóa cây!");
    }
});

app.get('/update/:id', async (req, res) => {
    try {
        const tree = await Tree.findById(req.params.id);
        res.render('update', { tree });
    } catch (error) {
        console.error("Lỗi tìm cây:", error);
        res.status(500).send("Không tìm thấy cây!");
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
        console.error("Lỗi cập nhật cây:", error);
        res.status(500).send("Lỗi khi cập nhật cây!");
    }
});


// Chạy server
app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
});
