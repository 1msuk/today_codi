const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer'); // Multer 불러오기
const app = express();

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/today-coord', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer 설정 (여기에 넣어야 합니다)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // uploads 폴더에 저장
    },
    filename: function (req, file, cb) {
        const safeFileName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 파일명 인코딩 처리
        cb(null, Date.now() + '-' + safeFileName); // 파일명 설정
    }
});
const upload = multer({ storage: storage }); // Multer 설정 끝

// MongoDB Schema 정의
const PostSchema = new mongoose.Schema({
    photos: [String],  // 사진 경로
    upper: String,     // 상의 URL
    lower: String,     // 하의 URL
    shoes: String,     // 신발 URL
    socks: String,     // 양말 URL
    accessories: String  // 악세사리 URL
});

const Post = mongoose.model('Post', PostSchema);

// 파일 및 데이터 업로드 경로 설정
app.post('/upload', upload.array('photos', 5), (req, res) => {
    const { upper, lower, shoes, socks, accessories } = req.body;
    
    // 파일 경로 추출
    const photos = req.files.map(file => file.path);

    // MongoDB에 게시물 저장
    const newPost = new Post({
        photos,
        upper,
        lower,
        shoes,
        socks,
        accessories
    });

    newPost.save()
        .then(() => {
            res.send('게시물이 성공적으로 업로드되었습니다!');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('게시물 업로드 중 오류가 발생했습니다.');
        });
});

// 서버 실행
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
