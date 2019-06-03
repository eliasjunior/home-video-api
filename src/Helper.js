export function requestParameter(label) {
  return Error(`${label} is required`);
}

export function flush({
  response = requestParameter('response'), 
  body = requestParameter('body'), 
  status = requestParameter('status')
}) {
  response
    .status(status)
    .json(body)
    .end();
}