import listBox from './use-cases/listBox';
import { getFolderByName } from '../adaptors/DataAccessAdaptor';
export default listBox({ getFolderByName });