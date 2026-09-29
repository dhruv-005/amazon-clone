import User from '../models/User.js';
import { generateTokens } from '../utils/generateToken.js';

export const authenticateCredentials = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  if (user.isBanned) throw new Error('Account suspended');
  if (!user.isActive) throw new Error('Account deactivated');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const tokens = generateTokens(user);
  return { user, ...tokens };
};

export default {
  authenticateCredentials,
};
