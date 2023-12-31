const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
    // Get all user
    async getUsers(req, res) {
        try {
            const users = await User.find()
            .select('-__v')
            .populate('thoughts', 'friends');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts', 'friends');

            if(!user) {
                return res.status(404).json({ message: 'No user with this ID'});
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            
            if(!user) {
                return res.status(404).json({ message: 'No user with this ID'});
            }

            res.json(user);
        } catch (err) {
            res.status(505).json(err);
        }
    },
    // Delete a user and associated thoughts
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if(!user) {
                return res.status(404).json({ message: 'No user with this ID' });
            }

            await Thought.deleteMany({ _id: { $in: user.thoughts }});

            res.json({ message: 'User and associated thoughts deleted!'})
        } catch (err) {
            res.status(500).json(err);
        }
    },
        // Add a friend to a user
        async addFriend(req, res) {
            try {
                const user = await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $addToSet: { friends: req.body.friendId }},
                    { runValidators: true, new: true }
                );
    
                if (!user) {
                    return res.status(404).json({ message: 'No user with this ID!'});
                }
    
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        },
        // Remove a Friend
        async removeFriend(req, res) {
            try {
                const user = await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $pull: { friends: {_id: req.params.friendId }}},
                    { runValidators: true, new: true }
                );
    
                if (!user) {
                    return res.status(404).json({ message: 'No user found on this ID!'});
                }
    
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        },
};
