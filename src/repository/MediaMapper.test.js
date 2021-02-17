import {mapMedia} from "./MediaMapper";
import path from 'path';

describe("MediaMapper", ()=> {
    it("should map a media", () => {
        const fileList = ["myMovie.mp4", "myMovie.srt"]

        const fileExtEqual = (fileName) => {
            return path.extname(fileName).toLowerCase();
        }
        const objMedia = mapMedia(fileList, "some", fileExtEqual)
        const expected = {
          name: "myMovie.mp4",
          sub: "myMovie.srt",
          description: "",
          id: "some",
          img: "movie_fallback.png",
        };
        expect(objMedia).toEqual(expected);
    })
})