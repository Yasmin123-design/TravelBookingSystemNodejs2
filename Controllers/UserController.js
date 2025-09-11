const userModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../Config/nodemailer");

module.exports = {
    async Register(req,res){
        console.log("register");
        try
        {
            const  {name , email ,password} = req.body;
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            let role = "user";
            const adminEmail = "admin@email.com"; 
            if (email === adminEmail) {
                role = "admin";
            }
            await userModel.createUser({
                name:name,
                email:email,
                password:hashedPassword,
                role: role
            });
            res.status(201).json({ message: "User registered successfully" });
        }
        catch(err)
        {
            res.status(501).json({message:err.message});
        }
    },
    async Login(req,res){
        try
        {
            const  {email ,password} = req.body;
            const enteredUser = await userModel.findByEmail(email);
            if(!enteredUser)
            {
                return res.status(400).json({ error: "Invalid credentials" });
            }
            const isMatch = await bcrypt.compare(password, enteredUser.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
            const JWT_SECRET = process.env.JWT_SECRET;
            
            const token = jwt.sign(
                { _id: enteredUser._id,
                email: enteredUser.email,
                role:enteredUser.role
                },
                JWT_SECRET,
                { expiresIn: "3h" }
            );

            res.json({ message: "Login successful", token , role: enteredUser.role});
        }
        catch(err)
        {
            res.status(501).json({message:err.message});
        }
    },
    async getMe(req, res) {
    try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userData } = user;

    res.json(userData);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
    },
    async updateMe(req,res)
    {
        try {
        const userId = req.user._id; 
        const {name} = req.body;

        const result = await userModel.updateUser(userId,name)

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    },
    async updatePassword(req,res)
    {
        try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        await userModel.updatePassword(userId, oldPassword, newPassword);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    },
    async  getAllUsers(req, res) {
        try {
        const users = await userModel.findAll();
        res.json(users);
        } catch (err) {
        res.status(500).json({ error: err.message });
        }
    },

    async  forgotPassword(req, res) {
    try {
    const { email } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await sendEmail(
    email, 
    "Reset your password", 
    `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    );
    res.json({ message: "Reset link sent to your email" });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
},
async  resetPassword(req, res) {
    try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Token missing" });

    const token = authHeader.split(" ")[1]; 
    const { newPassword } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(400).json({ message: "Invalid or expired token" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateRestedPassword(decoded.id, hashedPassword);

        res.json({ message: "Password reset successful" });
    });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
}

}
