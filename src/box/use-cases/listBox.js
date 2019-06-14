
import File from '../entities/File';
const { makeFile } = File();

export default function makeBoxComponent({ getFolderByName }) {
  return {
    loadBox() {
      //TODO: need async method
      const components = getFolderByName({})
        .map(rawFile => {
          return  makeFile({ ...rawFile });
        });
      return components;
    },
  }
}