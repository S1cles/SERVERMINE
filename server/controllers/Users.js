import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from 'path'

// export const getUsers = async (req, res) => {
//     try {
//         const users = await Users.findAll({
//             attributes: ['id', 'name', 'email']
//         });
//         res.json(users);
//     } catch (error) {
//         console.log(error);
//     }
// }

export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (user) {
        res.status(403).json({ msg: 'Email exists' });
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


export const Time = async(req,res)=>{
    const timeUser = await Users.findOne({
        where: {
            email: req.query.email,
        }
    });
    if(timeUser){
        res.json({createdAt:timeUser.createdAt , updatedAt:timeUser.updatedAt})
    }else{
        res.status(404).json({message: 'Something wrong with time request'})
    }
   
}



//UPLOAD 
export const Upload = async (req, res) => { 

    
        try { 
            const fileSkin = req.files.skin 
            let {name} = req.body 
            if(name === undefined || name === "default"){ 
                return res.status(403).json("Name is Null") 
            }
            let fileName = name + `.${fileSkin.mimetype.split('/')[1]}` 
            fileSkin.mv(path.join( '../client/public/skins/', fileName)) 
            // console.log(fileSkin.mv(path.join( '../../client/public/skins/', fileName)) )
            res.status(200).json("OK") 
        } 
        catch (error) { 
            return res.status(500).json({message: error.message}); 
        }    
    


    // try { 
    //     const file = req.files.skin
    //     console.log(file)
    //     let {name} = req.body
    //     if(!name){ 
    //         return res.status(403).json("Name is Null") 
    //     }
    //     let fileName = name + `.${file.mimetype.split('/')[1]}`
    //     file.mv(path.join(__dirname, '../public/skins', fileName)) 
    //     return res.status(200).json("OK")
    // } 
    // catch (error) { 
    //     return res.status(500).json({message: error.message}); 
    // }    
    
    
    
    // try { 
    //     console.log(req.body)
    //     const file = req.files
    //     console.log(file)
    //     let {name} = req.body
    //     if(name === undefined || name === "default"){ 
    //         return res.status(403).json("Name is Null") 
    //     }
    //     let fileName = name + `.${file.mimetype.split('/')[1]}`
    //     file.mv(path.join(__dirname, '../../client/public/skins/', fileName)) 
    //     res.status(200).json("OK")
    // } 
    // catch (error) { 
    //     return res.status(500).json({message: error.message}); 
    // }    
}
