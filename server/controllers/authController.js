import crypto from 'crypto';
import { generateToken } from '../middleware/auth.js';
import { store } from '../store.js';

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user.id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      websiteUrl: user.websiteUrl,
      businessCategory: user.businessCategory,
      location: user.location,
      competitors: user.competitors,
      onboardingComplete: user.onboardingComplete,
    },
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = store.users.find(u => u.email === email);
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    
    const user = {
      id: store.userIdCounter++,
      name,
      email,
      password,
      avatar: '',
      websiteUrl: '',
      businessCategory: '',
      location: '',
      competitors: [],
      onboardingComplete: false,
      createdAt: new Date()
    };
    store.users.push(user);
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = store.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;
    let user = store.users.find(u => u.email === email);
    if (!user) {
      user = {
        id: store.userIdCounter++,
        googleId,
        email,
        name,
        avatar: avatar || '',
        password: crypto.randomBytes(16).toString('hex'),
        websiteUrl: '',
        businessCategory: '',
        location: '',
        competitors: [],
        onboardingComplete: false,
        createdAt: new Date()
      };
      store.users.push(user);
    }
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = store.users.find(u => u.email === req.body.email);
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link was sent' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000;
    res.json({ success: true, message: 'Reset link sent (demo: use token in reset)', resetToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = store.users.find(u => u.resetPasswordToken === hashed && u.resetPasswordExpire > Date.now());
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  const user = store.users.find(u => u.id === req.user?.id);
  res.json({ success: true, user });
};

export const updateProfile = async (req, res) => {
  try {
    const userIndex = store.users.findIndex(u => u.id === req.user?.id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const fields = ['name', 'websiteUrl', 'businessCategory', 'location', 'competitors', 'onboardingComplete', 'avatar'];
    fields.forEach((f) => { 
      if (req.body[f] !== undefined) {
        store.users[userIndex][f] = req.body[f];
      }
    });
    res.json({ success: true, user: store.users[userIndex] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
