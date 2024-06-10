const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    var fragment = await Fragment.byId(req.user, req.params['id']);
    let data = await fragment.getData();
    if (fragment.isText) {
      data = data.toString();
    }

    res.status(200).set({ 'Content-Type': fragment.mimeType }).send(data);
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment does not exist'));
    logger.warn(
      { fragment, errorMessage: err.message },
      'request to non-existent fragment was made'
    );
  }
};
