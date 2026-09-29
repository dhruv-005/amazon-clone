// ============================================
// PASSPORT.JS CONFIGURATION - OAuth Strategies
// ============================================

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';
import config from './index.js';
import logger from './logger.js';

/**
 * Initialize Passport Strategies
 */
const initPassport = () => {
  // Serialize User
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize User
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // ---- GOOGLE OAUTH ----
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${config.clientUrl}/api/auth/google/callback`,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails[0].value;

            // Check if user exists
            let user = await User.findOne({ email });

            if (user) {
              // Link Google account if not already linked
              const hasGoogle = user.oauthProviders?.some(
                (p) => p.provider === 'google'
              );
              if (!hasGoogle) {
                user.oauthProviders = user.oauthProviders || [];
                user.oauthProviders.push({
                  provider: 'google',
                  providerId: profile.id,
                });
                await user.save();
              }
            } else {
              // Create new user
              user = await User.create({
                name: profile.displayName,
                email,
                avatar: profile.photos[0]?.value,
                isVerified: true,
                role: 'customer',
                oauthProviders: [
                  {
                    provider: 'google',
                    providerId: profile.id,
                  },
                ],
              });
            }

            done(null, user);
          } catch (error) {
            logger.error(`Google OAuth error: ${error.message}`);
            done(error, null);
          }
        }
      )
    );
    logger.info('✅ Google OAuth Strategy Loaded');
  } else {
    logger.warn('⚠️  Google OAuth credentials not found');
  }

  // ---- FACEBOOK OAUTH ----
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${config.clientUrl}/api/auth/facebook/callback`,
          profileFields: ['id', 'displayName', 'email', 'photos'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(new Error('Email not provided by Facebook'), null);
            }

            let user = await User.findOne({ email });

            if (user) {
              const hasFacebook = user.oauthProviders?.some(
                (p) => p.provider === 'facebook'
              );
              if (!hasFacebook) {
                user.oauthProviders = user.oauthProviders || [];
                user.oauthProviders.push({
                  provider: 'facebook',
                  providerId: profile.id,
                });
                await user.save();
              }
            } else {
              user = await User.create({
                name: profile.displayName,
                email,
                avatar: profile.photos?.[0]?.value,
                isVerified: true,
                role: 'customer',
                oauthProviders: [
                  {
                    provider: 'facebook',
                    providerId: profile.id,
                  },
                ],
              });
            }

            done(null, user);
          } catch (error) {
            logger.error(`Facebook OAuth error: ${error.message}`);
            done(error, null);
          }
        }
      )
    );
    logger.info('✅ Facebook OAuth Strategy Loaded');
  } else {
    logger.warn('⚠️  Facebook OAuth credentials not found');
  }
};

export default initPassport;
