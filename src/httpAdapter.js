module.exports = {
  requestAdapter: ({ params = {},
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