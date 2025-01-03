const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  if (!Fragment.isSupportedType(req.get('Content-Type'))) {
    res.status(415).json(createErrorResponse(415, 'Content-Type is not supported'));
  } else {
    try {
      const fragment = new Fragment({
        ownerId: req.user,
        type: req.get('Content-type'),
        size: req.body.length,
      });
      await fragment.setData(req.body);
      await fragment.save();
      res
        .set('location', `http://${req.headers.host}/v1/fragments/${fragment.id}`)
        .status(201)
        .send(createSuccessResponse({ fragment }));
      logger.info({ fragment: fragment }, `Fragment have been posted successfully`);
    } catch (err) {
      res.status(404).json(createErrorResponse(404, 'Unable to POST the fragment', { err }));
    }
  }
};
