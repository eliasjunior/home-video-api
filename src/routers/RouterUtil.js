export function sendError({ response, statusCode, message, error = {} }) {
  response
    .status(statusCode)
    .send({
      message: message,
      error: error.message,
    })
    .end();
}
