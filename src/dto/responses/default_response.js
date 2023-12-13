class Response {
  static defaultOK(message, data) {
    const res = {
      status: true,
      code: 200,
      message,
      data,
    };
    return res;
  }

  static defaultCreated(message, data) {
    const res = {
      status: true,
      code: 201,
      message,
      data,
    };
    return res;
  }

  static defaultBadRequest(data) {
    const res = {
      status: false,
      code: 400,
      message: 'Request body or parameters not match',
      data,
    };
    return res;
  }

  static defaultUnauthorized(data) {
    const res = {
      status: false,
      code: 401,
      message: 'Unauthorized access',
      data,
    };
    return res;
  }

  static defaultForbidden(data) {
    const res = {
      status: false,
      code: 402,
      message: 'Forbidden access',
      data,
    };
    return res;
  }

  static defaultNotFound(data) {
    const res = {
      status: false,
      code: 404,
      message: 'Record not found',
      data,
    };
    return res;
  }

  static defaultConflict(data) {
    const res = {
      status: false,
      code: 409,
      message: 'New data already exists',
      data,
    };
    return res;
  }

  static defaultInternalError(data) {
    const res = {
      status: false,
      code: 500,
      message: 'Request failed, server error',
      data,
    };
    return res;
  }
}

export default Response;
