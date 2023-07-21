const { Schema, model } = require('mongoose');

// Schema to create user model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'User email required'],
            unique: true,
            validate: {
                validator: function(v) {
                    return /^([\d\w\.-_]+)@([\d\w\.-_]+).([\d\w\.-_]+)$/.test(v)
                },
                message: props => `${props.value} is not a valid email!`
            },     
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

//Create virtual friendCount to retrieves the lenghth of the user's friends array
userSchema
    .virtual('friendCount')
    .get(function (v) {
        return this.friends.lenghth;
    });

const User = model('user', userSchema);

module.exports = User;
