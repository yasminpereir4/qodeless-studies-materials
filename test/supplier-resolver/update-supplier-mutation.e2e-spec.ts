import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { Supplier } from "../../src/entities/supplier.entity";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

const updateSupplierMutation = gql`
  mutation UpdateSupplier($id: ID!, $name: String!) {
    updateSupplier(id: $id, input: { name: $name }) {
      id
      name
    }
  }
`;

describe("Supplier Resolver update supplier mutation", () => {
  let app: INestApplication;
  let testClient: TestClient;
  let supplier: Supplier;

  const name = "First name";
  const updatedName = "Updated name";

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app);
    await app.init();
    testClient = new TestClient(app);
    supplier = await Supplier.create({ name }).save();
  });

  it("should validate name is at least 3 characters", async () => {
    const badResponse = await testClient.request(updateSupplierMutation, {
      id: supplier.id,
      name: "AB",
    });

    expect(badResponse.status).toBe(200);
    expect(badResponse.body.data.updateSupplier).toBeNull();
    expect(
      badResponse.body.errors[0].extensions.originalError.message,
    ).toContain("O nome deve conter no mínimo 3 caracteres.");

    const goodResponse = await testClient.request(updateSupplierMutation, {
      id: supplier.id,
      name: "ABC",
    });

    expect(goodResponse.status).toBe(200);
    expect(goodResponse.body.data.updateSupplier).not.toBeNull();
  });

  it("should update supplier successfully", async () => {
    const response = await testClient.request(updateSupplierMutation, {
      id: supplier.id,
      name: updatedName,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.updateSupplier).not.toBeNull();
    expect(response.body.data.updateSupplier.id).toBe(supplier.id);
    expect(response.body.data.updateSupplier.name).toBe(updatedName);
  });

  it("should not allow to update a supplier's name to one that already exists", async () => {
    const otherSupplier = await Supplier.create({ name }).save();
    const response = await testClient.request(updateSupplierMutation, {
      id: otherSupplier.id,
      name: updatedName,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.updateSupplier).toBeNull();
    expect(response.body.errors[0].message).toBe(
      "SqliteError: UNIQUE constraint failed: supplier.name",
    );
  });
});
