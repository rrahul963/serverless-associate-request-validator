/**
 * Associate the request validator with API methods.
 *
 * @param      {Object}  serverless  The serverless object.
 */
const associateValidator = function associateValidator(serverless) {
  const resources = serverless.service.resources.Resources;
  let requestValidator = '';
  Object.keys(resources)
    .filter(key => resources[key].Type === 'AWS::ApiGateway::RequestValidator')
    .forEach(key => {
      requestValidator = key;
    });

  if (requestValidator !== '') {
    const rsrc = serverless.service.provider.compiledCloudFormationTemplate.Resources;
    Object.keys(rsrc)
      .filter(key => rsrc[key].Type === 'AWS::ApiGateway::Method')
      .forEach(key => {
        rsrc[key].Properties.RequestValidatorId = { Ref: requestValidator };
      });
  }
};

/**
 * The class that will be used as serverless plugin.
 */
class AssociateRequestValidator {
  constructor(serverless, options) {
    this.options = options;
    this.hooks = {
      'before:package:finalize': function () {
        associateValidator(serverless);
      }
    };
  }
}

module.exports = AssociateRequestValidator;
