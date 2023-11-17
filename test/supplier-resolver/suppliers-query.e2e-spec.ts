import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { Supplier } from "../../src/entities/supplier.entity";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

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

  it("should return all suppliers in the database", async () => {
    const supplier = await Supplier.create({
      name: "Random supplier",
    }).save();

    const response = await testClient.request(gql`
      query {
        suppliers {
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
    `);

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(Array.isArray(response.body.data.suppliers)).toBe(true);
    expect(response.body.data.suppliers[0].id).toBe(supplier.id);
    expect(response.body.data.suppliers[0].name).toBe(supplier.name);
    expect(response.body.data.suppliers[0].electricMaterials).not.toBeNull();
    expect(response.body.data.suppliers[0].hydraulicMaterials).not.toBeNull();
    expect(response.body.data.suppliers[0].chemicalMaterials).not.toBeNull();
  });
});
