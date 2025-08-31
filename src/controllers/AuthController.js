import jwt from 'jsonwebtoken';
import passport from 'passport';

class AuthController {

    handleSignup = async (req, res) => {
        if (!req.user.name) {
            return res.status(409).json({ user: req.user.message });
        }
        res.status(201).json({ message: `${req.user.name} signed up successfully`, user: req.user });
    }

    handleLogin = async (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
            try {
                if (err || !user) {
                    err = err || new Error('Login failed');
                    return next(err);
                }

                req.login(user, { session: false }, async (err) => {
                    if (err) {
                        return next(err);
                    }

                    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });
                    res.status(200).json({ message: "User logged in successfully", token });
                });
            } catch (error) {
                return next(error);
            }

        })(req, res, next);
    }
}

export { AuthController }