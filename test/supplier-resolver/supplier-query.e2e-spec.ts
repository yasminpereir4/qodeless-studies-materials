import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { Supplier } from "../../src/entities/supplier.entity";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

const supplierQuery = gql`
  query Supplier($id: ID!) {
    supplier(id: $id) {
      id
      name
      electricMaterials {
        id
        name
        quantityInStock
      }
      hydraulicMaterials {
        id
        name
        quantityInStock
      }
      chemicalMaterials {
        id
        name
        quantityInStock
      }
    }
  }
`;

describe("Supplier Resolver supplier query", () => {
  let app: INestApplication;
  let testClient: TestClient;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app);
    await app.init();
    testClient = new TestClient(app);
  });

  it("should return supplier by id", async () => {
    const supplier = await Supplier.create({
      name: "Supplier supplier",
    }).save();

    const response = await testClient.request(supplierQuery, {
      id: supplier.id,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.supplier.id).toBe(supplier.id);
    expect(response.body.data.supplier.name).toBe(supplier.name);
    expect(response.body.data.supplier.electricMaterials).not.toBeNull();
    expect(response.body.data.supplier.hydraulicMaterials).not.toBeNull();
    expect(response.body.data.supplier.chemicalMaterials).not.toBeNull();
  });

  it("should not return supplier by id if it doesn't exist", async () => {
    const response = await testClient.request(supplierQuery, {
      id: "supplier-id",
    });

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.supplier).toBeNull();
  });
});
