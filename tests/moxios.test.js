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
    // Usamos un regex para no tener que escribir la url exacta 
    // le match como https://reqres.in/api/users/2 termina en /users/2
    // con la regex se puede matchear el final del string
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
    // como /users/3 no esta configurado es necesario agregar 
    // un match default de otra forma va colgar el test
    moxios.stubRequest(/.*/, {
      status: 500,
      response: { message: "error" },
    });
    const response = await request.get("/users/3");
    // deberia matcher el default y por tanto propagar el 500
    // segun la logica en routes
    expect(response.status).toBe(500);
  });

  it("capture args", async () => {
    moxios.stubRequest(/.*\/users\/2/, {
      status: 200,
      response: { email: "hello@mail.com" },
    });
    const response = await request.get("/users/2");
    expect(response.status).toBe(200);
    // moxios.requests es la lista de request que recibio moxios
    // mostRecent() devuelve el ultimo.
    // ademas de url se puede inspecionar el body y los headers.
    expect(moxios.requests.mostRecent().url).toBe(
      "https://reqres.in/api/users/2"
    );
  });
});
