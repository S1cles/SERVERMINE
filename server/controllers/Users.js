import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from 'path'
import fs from 'fs';


export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (user) {
        res.status(403).json({ msg: 'Email exists' });
    }
    const userName = await Users.findOne({ where: { name } });
    if (userName) {
        res.status(403).json({ msg: 'Name exists' });
    }
    else {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.create({
                name: name,
                email: email,
                password: hashPassword
            });
            res.json({ msg: "Registration Successful" });
        } catch (error) {
            console.log(error);
        }
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "Email not found" });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}


export const Time = async (req, res) => {
    const timeUser = await Users.findOne({
        where: {
            email: req.query.email,
        }
    });
    if (timeUser) {
        res.json({ createdAt: timeUser.createdAt, updatedAt: timeUser.updatedAt })
    } else {
        res.status(404).json({ message: 'Something wrong with time request' })
    }

}



//UPLOAD 
export const Upload = async (req, res) => {


    try {
        const fileSkin = req.files.skin
        let { name } = req.body
        if (name === undefined || name === "default") {
            return res.status(403).json("Name is Null")
        }
        let fileName = name + `.${fileSkin.mimetype.split('/')[1]}`
        fileSkin.mv(path.join('../client/public/skins/', fileName))
        res.status(200).json("OK")
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//email change
export const NewEmail = async (req, res) => {
    try {
        const email = req.body.email
        const newEmail = req.body.newEmail
        if(!email||!newEmail){ 
            return res.status(500).json('Something WRONG')
        }
        const userExists = await Users.findOne({
            where: {
                email: newEmail
            }
        });

        if (userExists) {
            return res.json({message:'User Exists'});
        }
   

        await Users.update({ email: newEmail }, {
            where: {
                email: req.body.email
            }
        });
        res.json({message:`Your email will be changed soon. Your new email: ${newEmail}`})

    } catch (error) {
        console.log(error)
        res.json({message:'Something wrong'})
    }
}



//password change
export const NewPassword = async (req, res) => {
    try {
        const email = req.body.email
        const newPassword = req.body.newPassword
        if(!newPassword){ 
            return res.status(500).json('Something WRONG')
        }
        if(!email){
            return res.status(500).json('Something WRONG')
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);
        await Users.update({ password: hashPassword }, {
            where: {
                email: email
            }
        });
        res.json({message:'Password updated'})

    } catch (error) {
        console.log(error)
        res.json({message:'Something wrong'})
    }
}


//Name change
export const NewName = async (req, res) => {
    try {
        const email = req.body.email
        const newName= req.body.newName
        if(!email || !newName){ 
            return res.status(500).json({message:'Something WRONG'})
        }
        const userExists = await Users.findOne({
            where: {
                name: newName
            }
        });

        if (userExists) {
            return res.json({message:'User Exists'});
        }
        try {
            const currentUser = await Users.findOne({ where: { email } })
        const currentFileName = currentUser.name + '.png'
        const newFileName = newName + '.png'
        fs.renameSync(`../client/public/skins/${currentFileName}`, `../client/public/skins/${newFileName}`)
        } catch (error) {
            return console.log(error)
        }
        
        await Users.update({ name: newName }, {
            where: {
                email: email
            }
        });
        res.json({message:'Nickname updated'})

    } catch (error) {
        console.log(error)
        res.json({message:'Something wrong'})
    }
}