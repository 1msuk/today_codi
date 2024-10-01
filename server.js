const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/today-coord', {
    // useNewUrlParser와 useUnifiedTopology 옵션은 제거 가능
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));


// 루트 경로에서 index.html 파일 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 실행
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
