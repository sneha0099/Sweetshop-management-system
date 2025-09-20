
import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
    firstname: string;
    lastname?: string;
    role: 'user' | 'admin';
    email: string;
    password: string;
    verified: boolean;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateToken(): string;
}

const userSchema = new Schema<IUser>({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const saltRound = 10;
    this.password = await bcrypt.hash(this.password, saltRound);
    next();
});

interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateToken(): string;
}

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.TOKEN_SECRET as string,
        {
            expiresIn: "5d",
        }
    );
};

export const User = model<IUser>("User", userSchema);