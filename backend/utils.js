import jwt from "jsonwebtoken";

export const generateToken = (user) =>
{
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.isAdmin,
        }, process.env.JWT_SECRET || 'somethingssecrets', 
        {
            expiresIn: '30d'
        });
}