import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
        },
    },
    password: {
        type: String,
        required: true,
        validate: [
            {
                validator: (value) => validator.isStrongPassword(value),
                message: '{VALUE} is not a strong password',
            },
        ],
    },
},
{
    timestamps: true,
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function(givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
}

const User = mongoose.model('User', UserSchema);

export default User;
