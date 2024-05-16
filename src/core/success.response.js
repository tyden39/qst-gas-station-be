const {ReasonPhrases, StatusCodes} = require("../constants/httpStatusCode");

class SuccessResponse {
  constructor({message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, data = {}}) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.data = data
  }

  send(res, header = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({message, data = {}}) {
    super({message, data})
  }
}

class CREATED extends SuccessResponse {
  constructor({message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, data, options = {}}) {
    super({message, statusCode, reasonStatusCode, data})
    this.options = options
  }
}

module.exports = {
  OK,
  CREATED
}