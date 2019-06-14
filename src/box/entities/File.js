import Box from '../Box';
import FileItem from '../FileItem';
import { requestParameter } from '../../Helper';

export default function File() {
  return {
    makeFile: ({
      name = requestParameter('File Name'),
      files,
      path,
      isFolder
    }) => {
      // factory component
      return isFolder ?
        new Box({
          name,
          path,
          children: files,
        })
        :
        new FileItem({
          name,
          path,
          content: '',
        });
    },
  }
}