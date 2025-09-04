const userDb = require('../models/userSchema');
const itemDb = require('../models/itemSchema');
const bcrypt = require('bcrypt');
const { jwtEncode } = require('../middleware/authorization');

module.exports = {
    register: async (req, res) => {
        const { email, passwordOne } = req.body;

        const existingUser = await userDb.findOne({ email });
        if (existingUser) {
            return res.send({ success: false, message: "Email already registered" });
        }
        const passwordHash = await bcrypt.hash(passwordOne, 10);
        const newUser = new userDb({
            email,
            password: passwordHash,
        });
        await newUser.save();

        console.log("register ok");
        res.send({
            success: true,
            message: "Registration successful",
            data: { _id: newUser._id, email: newUser.email, money: newUser.money  } });
    },
    login: async (req, res) => {
        const { email, password } = req.body;

        const foundUser = await userDb.findOne({ email });
        if (!foundUser) {
            return res.send({ success: false, message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        if (!passwordMatch) {
            return res.send({ success: false, message: "Incorrect password" });
        }

        const token = await jwtEncode({ _id: String(foundUser._id), email: foundUser.email });
        console.log(`login ok ${token}`);

        res.send({
            success: true,
            message: "Logged in successfully",
            token,
            data: {_id: String(foundUser._id), email: foundUser.email, money: foundUser.money}
        });
    },
    createitem: async (req, res) => {
        const { title, image, price } = req.body;
        const user = req.user;

        const newItem = new itemDb({
            title,
            image,
            price,
            userId: user._id,
            userEmail: user.email,
        });

        await newItem.save();
        console.log("create ok");
        res.send({ success: true, message: 'Item created successfully', data: newItem });
    },
    allitems: async (req, res) => {
        const items = await itemDb.find().lean();
        res.send({ success: true, data: items });
    },
    reserveItem: async (req, res) => {
        const user = req.user;
        const { itemId } = req.params;

        const item = await itemDb.findById(itemId);
        if (!item) return res.send({ success: false, message: "Item not found" });

        if (item.reservedBy) {
            return res.send({ success: false, message: "Item already reserved" });
        }

        const foundUser = await userDb.findById(user._id);
        if (!foundUser) return res.send({ success: false, message: "User not found" });

        if (foundUser.money < item.price) {
            return res.send({ success: false, message: "Not enough money" });
        }

        foundUser.money -= item.price;
        await foundUser.save();

        item.reservedBy = user._id;
        await item.save();

        res.send({
            success: true,
            message: "Item reserved",
            data: item,
            user: { _id: foundUser._id, email: foundUser.email, money: foundUser.money }
        });
    },
    removeReservation: async (req, res) => {
        const user = req.user;
        const { itemId } = req.params;

        const item = await itemDb.findById(itemId);
        if (!item) return res.send({ success: false, message: "Item not found" });

        if (item.reservedBy !== user._id) {
            return res.send({ success: false, message: "You cannot remove this reservation" });
        }

        const foundUser = await userDb.findById(user._id);
        if (!foundUser) return res.send({ success: false, message: "User not found" });

        foundUser.money += item.price;
        await foundUser.save();

        item.reservedBy = null;
        await item.save();

        res.send({
            success: true,
            message: "Reservation removed",
            data: item,
            user: { _id: foundUser._id, email: foundUser.email, money: foundUser.money }
        });
    },
    myReserved: async (req, res) => {
        const user = req.user;

        const items = await itemDb.find({ reservedBy: user._id }).lean();
        res.send({ success: true, data: items });
    },
    deleteItem: async (req, res) => {
        const user = req.user;
        const { itemId } = req.params;

        const item = await itemDb.findById(itemId);
        if (!item) return res.send({ success: false, message: "Item not found" });

        if (item.userId !== user._id) {
            return res.send({ success: false, message: "You can delete only your own items" });
        }

        if (item.reservedBy) {
            return res.send({ success: false, message: "Cannot delete reserved item" });
        }

        await itemDb.findByIdAndDelete(itemId);
        res.send({ success: true, message: "Item deleted", data: itemId });
    },
}