import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { ElectricMaterial } from "../../src/entities/electric-material.entity";
import { Supplier } from "../../src/entities/supplier.entity";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

const electricMaterialQuery = gql`
  query ElectricMaterial($id: ID!) {
    electricMaterial(id: $id) {
      id
      name
      quantityInStock
      supplier {
        id
        name
      }
    }
  }
`;

describe("Electric Material resolver electricMaterial query", () => {
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

  it("should return electric material by id", async () => {
    const supplier = await Supplier.create({
      name: "Electric material supplier name",
    }).save();

    const electricMaterial = await ElectricMaterial.create({
      name: "Electric material",
      supplierId: supplier.id,
      quantityInStock: 100,
    }).save();

    const response = await testClient.request(electricMaterialQuery, {
      id: electricMaterial.id,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.electricMaterial.id).toBe(electricMaterial.id);
    expect(response.body.data.electricMaterial.name).toBe(
      electricMaterial.name,
    );
    expect(response.body.data.electricMaterial.supplier).not.toBeNull();
    expect(response.body.data.electricMaterial.supplier.id).toBe(supplier.id);
    expect(response.body.data.electricMaterial.supplier.name).toBe(
      supplier.name,
    );
  });

  it("should not return electric material by id if it doesn't exist", async () => {
    const response = await testClient.request(electricMaterialQuery, {
      id: "electric-material-id",
    });

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.electricMaterial).toBeNull();
  });
});
