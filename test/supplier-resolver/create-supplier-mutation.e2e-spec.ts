import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

const createSupplierMutation = gql`
  mutation CreateSupplier($name: String!) {
    createSupplier(input: { name: $name }) {
      id
      name
    }
  }
`;

describe("Supplier Resolver create supplier mutation", () => {
  let app: INestApplication;
  let testClient: TestClient;
  const name = "Test supplier";

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app);
    await app.init();
    testClient = new TestClient(app);
  });

  it("should validate name is at least 3 characters", async () => {
    const badResponse = await testClient.request(createSupplierMutation, {
      name: "AB",
    });

    expect(badResponse.status).toBe(200);
    expect(badResponse.body.data).toBeNull();
    expect(
      badResponse.body.errors[0].extensions.originalError.message,
    ).toContain("O nome deve conter no mínimo 3 caracteres.");

    const goodResponse = await testClient.request(createSupplierMutation, {
      name: "ABC",
    });

    expect(goodResponse.status).toBe(200);
    expect(goodResponse.body.data).not.toBeNull();
  });

  it("should create new supplier successfully", async () => {
    const response = await testClient.request(createSupplierMutation, {
      name,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.createSupplier).toBeDefined();
    expect(typeof response.body.data.createSupplier.id === "string").toBe(true);
    expect(response.body.data.createSupplier.name).toBe(name);
  });

  it("should not allow to create a supplier with the same name as one that already exists", async () => {
    const response = await testClient.request(createSupplierMutation, {
      name,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      "SqliteError: UNIQUE constraint failed: supplier.name",
    );
  });
});
