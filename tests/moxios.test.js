const supertest = require("supertest");
const app = require("../routes");
const moxios = require("moxios");
const request = supertest(app);
describe("GET /user", function () {
  beforeEach(function () {
    moxios.install();
  });

  afterEach(function () {
    moxios.uninstall();
  });

  it("expect mocked response", async () => {
    moxios.stubRequest(/.*\/users\/2/, {
      status: 200,
      response: { email: "hello@mail.com" },
    });
    const response = await request.get("/users/2");
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("hello@mail.com");
  });

  it("expect mocked response, default 500", async () => {
    moxios.stubRequest(/.*\/users\/2/, {
      status: 200,
      response: { email: "hello@mail.com" },
    });
    moxios.stubRequest(/.*/, {
      status: 500,
      response: { message: "error" },
    });
    const response = await request.get("/users/3");
    expect(response.status).toBe(500);
  });

  it("capture args", async () => {
    moxios.stubRequest(/.*\/users\/2/, {
      status: 200,
      response: { email: "hello@mail.com" },
    });
    const response = await request.get("/users/2");
    expect(response.status).toBe(200);
    expect(moxios.requests.mostRecent().url).toBe(
      "https://reqres.in/api/users/2"
    );
  });
});
