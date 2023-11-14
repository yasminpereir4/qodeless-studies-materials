import { INestApplication } from "@nestjs/common";
import { print, type DocumentNode } from "graphql";
import request from "supertest";

export class TestClient {
  constructor(private app: INestApplication) {}

  request(document: DocumentNode, variables?: Record<string, any>) {
    return request(this.app.getHttpServer())
      .post("/graphql")
      .send({
        query: print(document),
        variables,
      })
      .set("Accept", "application/json")
      .set("Content-type", "application/json");
  }
}
