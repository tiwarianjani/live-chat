const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const salt = 10;

const app = express();
app.use(express.json());

// {
//     origin: ["http://localhost:5173"],
//     methods: ["POST", "GET"],
//     credentials: true
// }

app.use(cors());  // Enable CORS for all routes
app.use(cookieParser());


// Connection with MongoDB
mongoose.connect('mongodb+srv://sspacex18:Mongo%40db123@cluster0.kzmen7p.mongodb.net/');

// Schema or Model of Table/ collection
const User = mongoose.model('Users', { email: String, password: String, name: String });

const Group = mongoose.model('Groups', { gpname: String, createdBy: String, participants: [String] });

const Message = mongoose.model('Messages', { gpname: String, username: String, message: String });



// POST request for sign up --> add data in the database 
app.post('/signup', async (req, res) => {
    // Data sent through request
    const username = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    // Check if user already exists
    const existingUser = await User.findOne({ email: username });
    if (existingUser) {
        return res.status(400).json({ "msg": "User already exists" });
    }
    // Create a new user instance
    bcrypt.hash(password.toString(), salt, async (err, hash) => {
        if (err) {
            return res.status(500).json({ Error: "Internal Server Error in hashing" });
        }
        if (hash) {
            const user = new User({
                email: username,
                password: hash,
                name: name,
            });

            await user.save();  // Save data  
            return res.json({ Status: "Success", msg: "Ragisterd Successfully" });
        } else {
            return res.status(400).json({ Error: "Server Error" });
        }
    });
});

// Login User
app.post('/login', async (req, res) => {
    const username = req.body.email;
    const password = req.body.password;

    // Check usename exist or not
    const existingUser = await User.findOne({ email: username });

    if (!existingUser) {
        return res.status(400).json({ msg: "No such user already exists" });
    }
    // User Exist compare password 
    bcrypt.compare(password.toString(), existingUser.password, (err, response) => {
        if (response) {
            const name = existingUser.name;
            const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ Status: "Success", name: name, email: username });
        } else {
            return res.json({ Error: "Incorrect Password" });
        }
    });
});

// Create Groups
app.post('/create', async (req, res) => {
    console.log(req.body);
    const gpname = req.body.gpname;
    const createdBy = req.body.createdBy;
    const participants = req.body.participants;

    // Check Group Name Already exist or not
    const existingGp = await Group.findOne({ gpname: gpname });

    if (existingGp) {
        return res.status(400).json({ msg: "This groupname already exist. Try another!" });
    }

    // CRUD Table 
    const group = new Group({
        gpname: gpname,
        createdBy: createdBy,
        participants: participants,
    });

    await group.save();  // Save data  
    res.json({
        msg: "Group created successfully",
        Status: "Success"
    });
});

// Messages
app.post('/chats', async (req, res) => {
    const gpname = req.body.gpname;
    const username = req.body.username;
    const message = req.body.chat;

    // CRUD Table 
    const chat = new Group({
        gpname: gpname,
        username: username,
        message: message,
    });

    await chat.save();  // Save data  
    res.json({
        msg: "Message updated successfully",
        Status: "Success"
    });
});

// Retrieve all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Retrieve all groups
app.get('/groups', async (req, res) => {
    try {
        const groups = await Group.find();  // Retrieve all groups
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Retrieve all messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Updata group table
app.post('/updategroup', async (req, res) => {
    const gpname = req.body.gpname;
    const username = req.body.email;
    const action = req.body.action;

    try {
        let group = await Group.findOne({ gpname: gpname }); // Find Group 
        // Update participants based on action
        if (action === "JOIN") {
            group.participants.push(username); // Add username    
            // await group.save();
            res.json({ "msg": "Group Joined Successfully" });
        } else if (action === "EXIT") {
            // Remove username from participants if present
            const index = group.participants.indexOf(username);
            group.participants.splice(index, 1);
            // await group.save();
            res.json({ "msg": "Group Exit Successfully" });
        }
        else if (action === "DELETE") {   // Delete group 
            // Check if the user is the admin and if the user created the group
            const isadminPart = group.participants.filter((email) => email === group.createdBy);
            if (isadminPart && group.createdBy !== username) {
                return res.status(403).json({ "msg": "Not allowed to delete group" });
            }
            // Save the updated group  before update

            // Delete Group
            await Group.findOneAndDelete({ gpname: gpname });
            return res.json({ "msg": "Group Deleted Successfully" });
        } else {
            res.status(400).json({ "msg": "Invalid action" });
        }
        await group.save();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add and Remove Users from Group
app.post('/addremove', async (req, res) => {
    const gpname = req.body.gpname;
    const action = req.body.action; // Add or Remove action field in request body
    const users = req.body.users;

    try {
        let group = await Group.findOne({ gpname: gpname }); // Find Group 

        if (action === "ADD") {
            // Add users to the group
            for (const user of users) {
                if (!group.participants.includes(user)) {
                    group.participants.push(user);
                }
            }
            await group.save();
            res.json({ "msg": "Users Added Successfully" });
        } else if (action === "REMOVE") {
            // Remove users from the group
            for (const user of users) {
                const index = group.participants.indexOf(user);
                if (index !== -1) {
                    group.participants.splice(index, 1);
                }
            }
            await group.save();
            res.json({ "msg": "Users Removed Successfully" });
        } else {
            res.status(400).json({ "msg": "Invalid action" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Chat API Starts
// app.post('/yourgroups', async (req, res) => {
//     const email = req.body.email;
//     try {
//         const groups = await Group.find({ participants: email });
//         res.json(groups);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json("He is not in any group please create some group");
//     }
// });

// Retrieve all messages for specific group

// app.post('/messages', async (req, res) => {
//     try {
//         const groupname = req.body.groupname;
//         const messages = await Message.find({ gpname: groupname });
//         console.log(messages);
//         res.json(messages);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});



// Start the server
// Define your routes here

// const port = process.env.PORT || 3000;

// const server = app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// const io = require('socket.io')(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// io.on('connection', (socket) => {
//     console.log("User connected ");
//     console.log("id: ", socket.id);
//     socket.emit("welcome", "welcome");

//     socket.on('message', (msg) => {
//         console.log(msg);
//         socket.broadcast.emit('message', msg);
//     });

//     socket.on('disconnect', () => {
//         console.log("disconnected: ", socket.id);
//     });
// });

// node 
