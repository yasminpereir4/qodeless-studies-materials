import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { Supplier } from "../../src/entities/supplier.entity";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

const deleteSupplierMutation = gql`
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id)
  }
`;

describe("Supplier Resolver delete supplier mutation", () => {
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

  it("should delete supplier from the database", async () => {
    const supplier = await Supplier.create({
      name: "new supplier name",
    }).save();

    const response = await testClient.request(deleteSupplierMutation, {
      id: supplier.id,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.deleteSupplier).toBe(true);
    expect(await Supplier.findOne({ where: { id: supplier.id } })).toBeNull();
  });
});
