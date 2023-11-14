import { NestFactory } from "@nestjs/core";
import "dotenv/config";
import { AppModule } from "./app.module";
import { applyAppMiddleware } from "./utils/apply-app-middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyAppMiddleware(app);
  const port = parseInt(process.env.PORT || "5000");
  await app.listen(port);
  console.log(`Iniciou o servidor em: http://localhost:${port}`);
  console.log(`Playground: http://localhost:${port}/graphql`);
}
bootstrap();
