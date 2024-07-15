const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

module.exports = async (req, res) => {
  const query = path.parse(req.params.id);
  let extension = query.ext.split('.').pop();
  try {
    let fragmentMetadata = await Fragment.byId(req.user, query.name);
    let fragment = await fragmentMetadata.getData();
    extension = fragmentMetadata.extConvert(extension);

    if (query.ext == '' || fragmentMetadata.type.endsWith(extension)) {
      res.setHeader('Content-Type', fragmentMetadata.type);
      res.status(200).send(Buffer.from(fragment));
      logger.info(
        { fragmentData: fragment, contentType: fragmentMetadata.type },
        `Fragment data retrieved successfully!`
      );
    } else {
      try {
        if (fragmentMetadata.isText) {
          let result = await fragmentMetadata.textConvert(extension);
          res.setHeader('Content-Type', `text/${extension}`);
          res.status(200).send(Buffer.from(result));
          logger.info({ targetType: extension }, `Successful conversion to ${extension}`);
        }
      } catch (err) {
        res.status(415).json(createErrorResponse(415, `Unknown/Unsupported type`));
      }
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, `Unknown Fragment`));
  }
};
