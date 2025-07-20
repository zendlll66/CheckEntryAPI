const knex = require('../db/knex');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { password_hash } = require('../utils/password');

exports.login = async (req, res) => {
    try {
        //รับ phone กับ รหัสมา
        const { phone, password, firebase_token } = req.body;

        const user = await userModel.findUserByPhone(phone);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone"
            });
        }

        if (!user.password_hash) {
            return res.status(500).json({
                success: false,
                message: user
            });
        }

        // ตรวจสอบว่า firebase_token มีอยู่หรือยัง
        if (!firebase_token) {
            return res.status(400).json({
                success: false,
                message: "Firebase token is required"
            });
        }

        // เอา pass มาเทียบกับ hash ที่มีใน db
        const isMatch = await bcrypt.compare(String(password), String(user.password_hash));
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        const user2  = await userModel.updateToken(phone, firebase_token);
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: user2
        });
    
    } catch (err) {
        console.error(err); // log ไปก่อน
        res.status(500).json({
            success: false,
            message: err.message + " =>  catch error" || 'Internal server error'
        });
    }
}

exports.register = async (req, res) => {
    try {
        //รับค่าจาก body
        const { email, phone, password } = req.body;

        //หาว่ามีผู้ใช้งานนี้อยู่หรือยัง
        const duplicateCheck = await userModel.findUserByEmailOrPhone(email, phone);

        if (duplicateCheck.emailExists || duplicateCheck.phoneExists) {
            let errorMessage = 'การสมัครไม่สำเร็จ: ';
            const duplicateFields = [];

            if (duplicateCheck.emailExists) {
                duplicateFields.push('อีเมล');
            }
            if (duplicateCheck.phoneExists) {
                duplicateFields.push('เบอร์โทรศัพท์');
            }

            errorMessage += duplicateFields.join(' และ ') + ' นี้มีอยู่ในระบบแล้ว';

            return res.status(400).json({
                error: errorMessage,
                duplicateEmail: duplicateCheck.emailExists,
                duplicatePhone: duplicateCheck.phoneExists
            });
        }

        //เอารหัสมาทำการ hash
        const hashedPassword = await password_hash(password);

        //สร้าง User มีการทำการ hash รหัสผ่าน
        const newUser = await userModel.createUser(email, phone, hashedPassword);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.me = async (req, res) => {
    try {
        const { phone } = req.body;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}