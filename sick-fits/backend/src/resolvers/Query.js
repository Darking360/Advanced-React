const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  /*
    async items(parent, args, ctx, info) {
      const items = await ctx.db.query.items();
      return items;
    },
  */
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parent, args, ctx, info) {
    if (!ctx.request.userId) return null;
    else {
      return await ctx.db.query.user({
        where: {
          id: ctx.request.userId,
        },
      }, info);
    }
  },
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    console.log(ctx.request.userId);
    // 2. Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 2. if they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  async order (parent, { id }, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    // Query the current order
    const order = await ctx.db.query.order({
      where: { id },
    }, info);
    // Check if they have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error('You cannot see this');
    }  
    // Return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    // 1. Check if they are logged in
    const userId = ctx.request.userId;
    if (!userId) {
      throw new Error('You must be logged in!');
    }
    return ctx.db.query.orders({
      where: {
        user: { id: userId }
      },
    }, info);
  }
};

module.exports = Query;
