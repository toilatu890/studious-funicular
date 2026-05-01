const mongoose = require('mongoose');

// Link kết nối lấy từ hình ông gửi
// Tui đã thay <db_password> bằng mật khẩu tuxstore123 của ông
const uri = "mongodb+srv://tuxstore123:tuxstore123@cluster0.grxqemg.mongodb.net/TuxStoreData?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Chỉ chấp nhận POST');
    
    try {
        if (!mongoose.connections[0].readyState) await mongoose.connect(uri);
        const { type, username, password } = req.body;

        if (type === 'register') {
            const check = await User.findOne({ username });
            if (check) return res.status(400).json({ msg: 'Tên này đã có người dùng!' });
            const newUser = new User({ username, password });
            await newUser.save();
            return res.status(200).json({ msg: 'Đăng ký thành công sưng bro!' });
        }

        if (type === 'login') {
            const user = await User.findOne({ username, password });
            if (user) return res.status(200).json({ msg: 'Đăng nhập thành công!', user });
            return res.status(400).json({ msg: 'Sai tài khoản hoặc mật khẩu!' });
        }
    } catch (e) {
        return res.status(500).json({ msg: 'Lỗi Database: ' + e.message });
    }
}
