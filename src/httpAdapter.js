module.exports = {
  requestAdapt: ({ params = {},
    body = {},
    method = '',
    headers = {}
  }) => {
    return Object.freeze({
      params,
      body,
      method,
      headers: {
        range: headers.range
      }
    });
  },
  responseAdapter: () => {
    
  }
}