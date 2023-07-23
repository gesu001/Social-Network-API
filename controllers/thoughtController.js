const { Thought, User } =require('../models');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({_id: req.params.thoughtId});

            if(!thought) {
                return res.status(404).json({ message: 'No thought with that ID'});
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thougth.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.UserId },
                { $addToSet: { thoughts: thought._id}},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but found no user with that ID'
                });
            }

            res.json('Thought created!');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate (
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID'})
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    //Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404),json({ message: 'No thought found with that ID'})
            }

            const user = await User.findByIdAndDelete(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId }},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created but no user with this id!'
                });
            }

            res.json({ message: 'Thought successfully deleted!'})
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add a reaction to a thought
    async addReation(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body }},
                {runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this ID!'});
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Remove a reation
    async removeReation(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId }}},
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found on this ID!'});
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};