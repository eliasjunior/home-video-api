const defaultValues = [
  'Conan.The.Barberian',
  'The.Matrix',
]

function readSyncFile() {
  return currentFolder
}

function setCurretMockFiles(folder = defaultValues) {
  currentFolder = folder;
}

module.exports = {
  readSyncFile,
  setCurretMockFiles
}