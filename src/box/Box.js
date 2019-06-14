import BoxComponent from "./BoxComponent";

class Box extends BoxComponent {
  constructor({name, path, children}) {
    super();
    this.name = name;
    this.path = path;
    this.children = children;
    this.type = 'Folder';
  }
  getChildren() {
    return this.children.map(child => child);
  }
  getPath() {
    return this.path;
  }
  getName(){
    return this.name;
  }
  getType() {
    return 'Folder';
  }
}
export default Box;