export function logE(message, err) {
  console.error(message);
  if (err) {
    console.error(err);
  }
}

export function log(message) {
  console.log(message);
}

export function logD(message, show = false) {
  if (show) {
    console.log("Debug =============");
    console.log(message);
  }
}
