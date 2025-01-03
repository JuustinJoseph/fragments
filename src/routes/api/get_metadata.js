const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get metadata of the fragment by its passed id (GET /fragments/:id/info)
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).send(createSuccessResponse({ fragment: fragment }));
    logger.info({ fragmentInfo: fragment }, 'Fragment meta data has been successfully retrieved!');
  } catch (err) {
    res
      .status(404)
      .send(createErrorResponse(404, 'Fragment meta data with that ID not found', err));
  }
};
