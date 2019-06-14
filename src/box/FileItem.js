import BoxComponent from "./BoxComponent";

class FileItem extends BoxComponent {
  constructor({ name, path, content }) {
    super();
    this.name = name;
    this.path = path;
    this.content = content;
    this.type = 'FileItem';
  }
  getType() {
    return 'FileItem';
  }
  getName() {
    return this.name;
  }
  getPath() {
    return this.getPath;
  }
  getContent() {
    return this.content;
  }
}
export default FileItem;