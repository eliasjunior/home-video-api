export function logE(message, err) {
  console.error(` ====== ERR! ======= \n${message}`);
  if (err) {
    console.error(err);
  }
}

export function logD(message) {
  const { showdebug } = process.env;
  if (showdebug) {
    console.log("Debug =============");
    console.log(message);
  }
}
