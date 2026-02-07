import { getStartEndBytes } from "./StreamingUtilUseCase";
import { BASE_STREAM_CALC, EXPONENT } from "../../common/AppServerConstant";

describe("StreamingUtilUseCase.getStartEndBytes", () => {
  const chunkSize = Math.pow(BASE_STREAM_CALC, EXPONENT);

  it("calculates end within file size", () => {
    const size = 100000;
    const { start, end } = getStartEndBytes("bytes=0-", size);

    expect(start).toBe(0);
    expect(end).toBe(Math.min(chunkSize, size - 1));
  });

  it("caps end at size - 1 when range is near the end", () => {
    const size = 1000;
    const { start, end } = getStartEndBytes("bytes=900-", size);

    expect(start).toBe(900);
    expect(end).toBe(999);
  });

  it("handles non-numeric ranges by treating start as 0", () => {
    const size = 2000;
    const { start, end } = getStartEndBytes("bytes=-", size);

    expect(start).toBe(0);
    expect(end).toBe(Math.min(chunkSize, size - 1));
  });
});
