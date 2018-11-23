const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { makeANiceEmail, transport } = require('../mail');

const mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO check if they're logged in
    const item = await ctx.db.mutation.createItem({data: { ...args }}, info);
    return item;
  },
  updateItem(parent, args, ctx, info) {
    const updates = {...args};
    delete updates.id;
    return ctx.db.mutation.updateItem({
      data: updates,
      where: { id: args.id }
    }, info);
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // Find Item
    const item = await ctx.db.query.item({ where }, `{id title}`)
    // Check permissions
    // TODO
    // Then delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] }
      },
    }, info);
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    } else {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      } else {
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        return user;
      }
    }
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye' };
  },
  async requestReset(parent, { email }, ctx, info) {
    // Check if user is real
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    } else {
      const randomBytesPromiseified = promisify(randomBytes);
      const resetToken = (await randomBytesPromiseified(20)).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
      const res = ctx.db.mutation.updateUser({
        where: { email },
        data: { resetToken, resetTokenExpiry }
      });
      // Email reset
      const mailRes = await transport.sendMail({
        from: 'mbolivar100@gmail.com',
        to: user.email,
        subject: 'Your password reset token',
        html: makeANiceEmail(`Your password reset token is here! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`)
      });
      return { message: 'Thanks' };
    }
    // Reset token and set expiry of that user
    // Send email with reset token
  },
  async resetPassword(parent, { resetToken, newPassword, confirmPassword }, ctx, info) {
    // Check if passwords match
    if (newPassword != confirmPassword) {
      throw new Error("Your passwords don't match");
    }
    // Check if it is a legit reset token
    // Check if it is expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      }
    });
    if (!user) {
      throw new Error('This token is either invalid or expired');
    }
    // Hash the new password
    const password = await bcrypt.hash(newPassword, 10);
    // Save the new password to the user and remove resetToken
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        password
      },
    });
    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set JWT token to token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // Return the user
    return user;
  }
};

module.exports = mutations;
