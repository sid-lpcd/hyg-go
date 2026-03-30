import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getMock,
  postMock,
  patchMock,
  deleteMock,
  requestUseMock,
  responseUseMock,
  mapLocationMock,
  getTokenMock,
} = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  patchMock: vi.fn(),
  deleteMock: vi.fn(),
  requestUseMock: vi.fn(),
  responseUseMock: vi.fn(),
  mapLocationMock: vi.fn(),
  getTokenMock: vi.fn(),
}));

vi.mock("axios", () => ({
  __esModule: true,
  default: {
    create: vi.fn(() => ({
      get: getMock,
      post: postMock,
      patch: patchMock,
      delete: deleteMock,
      interceptors: {
        request: { use: requestUseMock },
        response: { use: responseUseMock },
      },
    })),
  },
  create: vi.fn(() => ({
    get: getMock,
    post: postMock,
    patch: patchMock,
    delete: deleteMock,
    interceptors: {
      request: { use: requestUseMock },
      response: { use: responseUseMock },
    },
  })),
}));

vi.mock("../../src/utils/tokenHelper", () => ({
  getToken: getTokenMock,
}));

vi.mock("../../src/utils/modelMappers", () => ({
  ModelMappers: {
    mapLocation: mapLocationMock,
  },
}));

import { getLocationByCoordinates } from "../../src/utils/apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    patchMock.mockReset();
    deleteMock.mockReset();
    mapLocationMock.mockReset();
    getTokenMock.mockReset();
  });

  it("adds Authorization header in request interceptor when token exists", async () => {
    getTokenMock.mockReturnValue({ token: "abc-token" });

    const requestInterceptor = requestUseMock.mock.calls[0][0] as (config: { headers: Record<string, string> }) => { headers: Record<string, string> };
    const config = requestInterceptor({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer abc-token");
  });

  it("queries coordinates even when latitude is 0", async () => {
    const mappedLocation = { locationId: "12", name: "Greenwich" };
    getMock.mockResolvedValue({ locationId: "12", name: "Greenwich" });
    mapLocationMock.mockReturnValue(mappedLocation);

    const result = await getLocationByCoordinates(0, -0.1);

    expect(getMock).toHaveBeenCalledWith("/locations/coordinates?lat=0&lng=-0.1");
    expect(result).toEqual(mappedLocation);
  });

  it("returns null for non-finite coordinates", async () => {
    const result = await getLocationByCoordinates(Number.NaN, 10);

    expect(result).toBeNull();
    expect(getMock).not.toHaveBeenCalled();
  });
});
