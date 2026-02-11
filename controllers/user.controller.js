import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST / register (create)
const registerUser = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(!name || !email || !password){
        return res.status(400).json({ok: false, message: "name, email and password are required"});
    }
    if(email && !email.includes("@")){
        return res.status(400).json({ok: false, message: "email must contain @"});
    }
    if(password.length < 6){
        return res.status(400).json({ ok: false, message: "password must be 6 letters long"})
    }

    //HASH PASSWORD
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create( {
        name,
        email,
        password: hashedPassword,
    });
    return res.status(201).json({ok:true, message: "registered successfully", data:{
        id: user._id,
        name: user.name,
        email: user.email,
    },
});
}

//POST /login
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            ok: false,
            message: "email and password are required",
        })
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({
            ok: false,
            message: "invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({
            ok: false,
            message: "invalid email or password",
        });
    }

    //Access token
    const accessToken = jwt.sign({
        id: user._id,
        role: user.role,    
    },
    process.env.JWT_ACCESS_SECRET,
    {
        expiresIn: process.env.JWT_ACCESS_EXPIRES
    },
);

    //Refresh token
    const refreshToken = jwt.sign({
        id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
        expiresIn: process.env.JWT_REFRESH_EXPIRES
    }
);

    //Store refresh tokens
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
        ok: true,
        message: "login successful",
        accessToken,
        refreshToken,
    });
};

//POST /refresh
const refreshAccessToken = async (req, res) => {
    const {refreshToken} = req.body;

    if(!refreshToken){
        return res.status(401).json({ok: false, message: "Refresh token required"});
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if(!user || user.refreshToken !== refreshToken){
        return res.status(403).json({ok: false, message: "Invalid refresh token"})
    }

    const newAccessToken = jwt.sign({
        id: user._id,
        role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
        expiresIn: process.env.JWT_ACCESS_EXPIRES
    },
);
    return res.status(200).json({
        ok: true,
        accessToken: newAccessToken,
    });
};

//POST /logout
const logoutUser = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  return res.status(200).json({
    ok: true,
    message: "Logged out successfully",
  });
};


//PATCH /users/:id/role
const makeAdmin = async(req,res) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({
            ok: false,
            message: "only admins can change roles",

        });
    }
    //prevent self promotion.
    if (req.user.id === req.params.id) {
    return res.status(400).json({
      ok: false,
      message: "You cannot change your own role",
    });
  }

  //find target user
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      ok: false,
      message: "User not found",
    });
  }

   // Update role
  user.role = "admin";
  await user.save();

  return res.status(200).json({
    ok: true,
    message: "User promoted to admin",
    data: {
      id: user._id,
      role: user.role,
    },
  });


}

//GET / users (read all users)
const readUsers = async (req, res)=>{
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const MAX_LIMIT = 50;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
    const skip = (page - 1) * limit;
    const filter = {};

    //sort
    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1; 

    if(req.query.email) {
        filter.email = {$regex: req.query.email, $options: "i"};
    }

    if(req.query.name){
        filter.name = {$regex: req.query.name, $options: "i"};//removing options means case sensitive
    }

    const users = await User.find(filter)
    .sort({ [sortField] : sortOrder})
    .skip(skip)
    .limit(limit);

    const total = await User.countDocuments(filter);
    return res.status(200).json({
        ok: true,
        page,
        limit,
        total,
        data: users,
    });
    
};

//GET/users/:id (read one user)
const getUserById = async (req, res)=>{
    const user = await User.findById(req.params.id);
    
    if(!user){
        return res.status(404).json({ok: false, message: "no user found"});
    }
    return res.status(200).json({ok: true, message: "user found", data: user});
}

//PUT /users/:id (update)
const updateUser = async (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;

    if(req.user.id !== req.params.id && req.user.role !== "admin" ){
        return res.status(403).json({
            ok: false,
            message: "Forbidden, not allowed",
        });
    }

    if(!name && !email){
        return res.status(400).json({ok: false, message:"nothing to update"});
    }
    if(email && !email.includes("@")){
        return res.status(400).json({ok: false, message: "email must contain @"});
    }
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {new: true});
    if (!user) {
    return res.status(404).json({ ok: false, message: "user not found" });
    }
    return res.status(200).json({ok: true, message: "updated successfully", data: user});
}

//DELETE /users/:id (delete)
const deleteUser = async (req, res)=>{
    const user = await User.findByIdAndDelete(req.params.id);

    if(req.user.id !== req.params.id && req.user.role !== "admin" ){
        return res.status(403).json({
            ok: false,
            message: "Forbidden, not allowed",
        });
    }

    if(!user){
        return res.status(404).json({ok: false, message: "user not found"})
    }
    return res.status(200).json({ok: true, message: "user deleted successfully", data: user});
}

export {registerUser, readUsers, getUserById, updateUser, deleteUser, loginUser, refreshAccessToken, logoutUser, makeAdmin};