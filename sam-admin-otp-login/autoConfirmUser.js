module.exports.confirmUser = (event, context, callback) => {
  event.response.autoConfirmUser = true;
  context.done(null, event);
};