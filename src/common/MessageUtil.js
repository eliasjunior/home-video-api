export function logE(message, err) {
  console.error(` ====== ERR! ======= \n${message}`);
  if (err) {
    console.error(err);
  }
}

export function logD(message, obj) {
  const { showdebug } = process.env;
  if (showdebug) {
    console.log(message, obj);
  }
}
