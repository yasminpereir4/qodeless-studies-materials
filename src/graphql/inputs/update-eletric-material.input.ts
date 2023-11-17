import { Field, InputType } from "@nestjs/graphql";
import { Min, MinLength } from "class-validator";

@InputType()
export class UpdateElectricMaterialInput {
  @Field()
  @MinLength(3, { message: "O nome deve conter no mínimo 3 caracteres." })
  name: string;

  @Field()
  @Min(0, {
    message: "A quantidade em estoque não pode ser um número negativo.",
  })
  quantityInStock: number;
}
