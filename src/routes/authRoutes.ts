import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = express.Router();

// Middleware to handle validation errors
const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
  ],
  validate, // <--- Stops the request here if validation fails
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  validate,
  login
);

export default router;