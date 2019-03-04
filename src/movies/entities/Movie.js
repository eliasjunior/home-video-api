function requestParameter(label) {
  return Error(`${label} is required`);
}

function Movie() {
  return {
    makeMedia: ({name = requestParameter('Media Name') , files, data}) => {
      return {
        name: validateName(name),
        id: name,
        data,
        files,
      }
    },
  }
}
function validateName(name) {
  const replaceSpecialCharBySpace = (prev, c) => {
    const regex = /[!\(\)\-\@#\$%\^\&*.]/g
    const result = regex.test(c);
    prev.push(result ? ' ' : c)
    return prev;
  }
  return name
    .split('')
    .reduce(replaceSpecialCharBySpace, [])
    .join('')
    .trim()
}
module.exports = Movie();