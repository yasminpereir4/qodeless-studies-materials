import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "node:path";
import { ChemicalMaterialResolver } from "./graphql/resolvers/chemical-material.resolver";
import { ElectricMaterialResolver } from "./graphql/resolvers/electric-material.resolver";
import { HydraulicMaterialResolver } from "./graphql/resolvers/hydraulic-material.resolver";
import { SupplierResolver } from "./graphql/resolvers/supplier.resolver";

@Module({
  imports: [
    SupplierResolver,
    ElectricMaterialResolver,
    HydraulicMaterialResolver,
    ChemicalMaterialResolver,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      sortSchema: true,
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: path.join(__dirname, "src", "schema.gql"),
    }),
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database:
        process.env.NODE_ENV === "test"
          ? ":memory:"
          : path.join(__dirname, "..", "database.sqlite"),
      entities: [path.join(__dirname, "entities", "*.entity{.ts,.js}")],
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV === "development",
    }),
  ],
})
export class AppModule {}
