import StreamingApi from "../libs/StreamingLib";
import StreamingData from "./StremingUseCase";
import fileAcess from "../accessData";

export default StreamingData({
  streamingApi: StreamingApi(),
  accessDataApi: fileAcess,
});
