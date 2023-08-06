import { getImageUrl } from "./Util";

describe("Util", () => {
  it("should get the url from the images map", () => {
    const movieMap = {
      ema2019: {
        folder: "ema",
        imgName: "ema.jpg",
        year: "2019",
      },
    };

    const result = getImageUrl(
      "ema2019",
      movieMap,
      "http://localhost:80/images"
    );

    expect(result).toEqual("http://localhost:80/images/ema/ema.jpg");
  });
});
