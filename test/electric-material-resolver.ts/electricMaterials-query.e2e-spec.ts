import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { ElectricMaterial } from "../../src/entities/electric-material.entity";
import { Supplier } from "../../src/entities/supplier.entity";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

describe("Electric Materials Resolver supplier query", () => {
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

  it("should return all electric materials in the database", async () => {
    const supplier = await Supplier.create({
      name: "Electric material supplier",
    }).save();

    const electricMaterial = await ElectricMaterial.create({
      name: "Electric material name",
      supplierId: supplier.id,
      quantityInStock: 150,
    }).save();

    const response = await testClient.request(gql`
      query ElectricMaterials {
        electricMaterials {
          id
          name
          quantityInStock
          supplier {
            id
            name
          }
        }
      }
    `);
    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(Array.isArray(response.body.data.electricMaterials)).toBe(true);
    expect(response.body.data.electricMaterials.length).toBeGreaterThan(0);
    expect(response.body.data.electricMaterials[0].id).toBe(
      electricMaterial.id,
    );
    expect(response.body.data.electricMaterials[0].name).toBe(
      electricMaterial.name,
    );
    expect(response.body.data.electricMaterials[0].quantityInStock).toBe(
      electricMaterial.quantityInStock,
    );
    expect(response.body.data.electricMaterials[0].supplier).not.toBeNull();
    expect(response.body.data.electricMaterials[0].supplier.id).toBe(
      supplier.id,
    );
    expect(response.body.data.electricMaterials[0].supplier.name).toBe(
      supplier.name,
    );
  });
});
