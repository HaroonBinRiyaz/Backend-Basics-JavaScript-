import { User } from "../models/user.model.js";

// POST / register (create)
const registerUser = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    if(!name || !email){
        return res.status(400).json({ok: false, message: "name and email required"});
    }
    if(email && !email.includes("@")){
        return res.status(400).json({ok: false, message: "email must contain @"});
    }
    const user = await User.create( {
        name,
        email
    })
    return res.status(201).json({ok:true, message: "registered successfully", data: user});
}

//GET / users (read all users)
const readUsers = async (req, res)=>{
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
    .sort({ createdAt : -1})
    .skip(skip)
    .limit(limit);

    const total = await User.countDocuments();
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
    const user = await User.findById(req.params.id)
    
    if(!user){
        return res.status(404).json({ok: false, message: "no user found"});
    }
    return res.status(200).json({ok: true, message: "user found", data: user});
}

//PUT /users/:id (update)
const updateUser = async (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;

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

    if(!user){
        return res.status(404).json({ok: false, message: "user not found"})
    }
    return res.status(200).json({ok: true, message: "user deleted successfully", data: user});
}

export {registerUser, readUsers, getUserById, updateUser, deleteUser};