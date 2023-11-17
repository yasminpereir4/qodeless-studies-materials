import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import gql from "graphql-tag";
import { AppModule } from "../../src/app.module";
import { ElectricMaterial } from "../../src/entities/electric-material.entity";
import { Supplier } from "../../src/entities/supplier.entity";
import { applyAppMiddleware } from "../../src/utils/apply-app-middleware";
import { TestClient } from "../TestClient";

const electricMaterialSupplierMutation = gql`
  mutation CreateElectricMaterial($input: CreateElectricMaterialInput!) {
    createElectricMaterial(input: $input) {
      id
      name
      supplierId
      quantityInStock
    }
  }
`;

describe("Electric material Resolver createElectricMaterial mutation", () => {
  let app: INestApplication;
  let testClient: TestClient;
  let supplier: Supplier;
  const name = "Test electric material";

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app);
    await app.init();
    testClient = new TestClient(app);
    supplier = await Supplier.create({
      name: "Test electric material supplier",
    }).save();
  });

  it("should validate name is at least 3 characters", async () => {
    const badResponse = await testClient.request(
      electricMaterialSupplierMutation,
      {
        input: {
          name: "AB",
          quantityInStock: 100,
          supplierId: supplier.id,
        },
      },
    );

    expect(badResponse.status).toBe(200);
    expect(badResponse.body.data).toBeNull();
    expect(
      badResponse.body.errors[0].extensions.originalError.message,
    ).toContain("O nome deve conter no mínimo 3 caracteres.");

    const goodResponse = await testClient.request(
      electricMaterialSupplierMutation,
      {
        input: {
          name: "ABC",
          quantityInStock: 100,
          supplierId: supplier.id,
        },
      },
    );

    expect(goodResponse.status).toBe(200);
    expect(goodResponse.body.data).not.toBeNull();
  });

  it("should validate quantityInStock is not a negative number", async () => {
    const badResponse = await testClient.request(
      electricMaterialSupplierMutation,
      {
        input: {
          name: "ABCDF",
          quantityInStock: -1,
          supplierId: supplier.id,
        },
      },
    );

    expect(badResponse.status).toBe(200);
    expect(badResponse.body.data).toBeNull();
    expect(
      badResponse.body.errors[0].extensions.originalError.message,
    ).toContain("A quantidade em estoque não pode ser um número negativo.");

    const goodResponse = await testClient.request(
      electricMaterialSupplierMutation,
      {
        input: {
          name: "ABCDEF",
          quantityInStock: 0,
          supplierId: supplier.id,
        },
      },
    );

    expect(goodResponse.status).toBe(200);
    expect(goodResponse.body.data).not.toBeNull();
  });

  it("should create new electric material successfully", async () => {
    const quantityInStock = 1000;

    const response = await testClient.request(
      electricMaterialSupplierMutation,
      {
        input: {
          name,
          quantityInStock,
          supplierId: supplier.id,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.createElectricMaterial).toBeDefined();
    expect(
      typeof response.body.data.createElectricMaterial.id === "string",
    ).toBe(true);
    expect(response.body.data.createElectricMaterial.name).toBe(name);
    expect(response.body.data.createElectricMaterial.quantityInStock).toBe(
      quantityInStock,
    );
    expect(response.body.data.createElectricMaterial.supplierId).toBe(
      supplier.id,
    );
    expect(
      await ElectricMaterial.findOne({
        where: {
          id: response.body.data.createElectricMaterial.id,
        },
      }),
    ).not.toBeNull();
  });

  it("should not allow to create an electric material with the same name as one that already exists", async () => {
    const response = await testClient.request(
      electricMaterialSupplierMutation,
      {
        input: {
          name,
          quantityInStock: 1000,
          supplierId: supplier.id,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toBe(
      "SqliteError: UNIQUE constraint failed: electric_material.name",
    );
  });
});
