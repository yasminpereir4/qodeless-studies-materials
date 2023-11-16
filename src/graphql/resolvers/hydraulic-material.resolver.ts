import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { HydraulicMaterial } from "../../entities/hydraulic-material.entity";
import { CreateHydraulicMaterialInput } from "../inputs/create-hydraulic-material.input";
import { UpdateHydraulicMaterialInput } from "../inputs/update-hydraulic-material.input";

@Resolver(() => HydraulicMaterial)
export class HydraulicMaterialResolver {
  @Query(() => [HydraulicMaterial])
  async hydraulicMaterials() {
    return HydraulicMaterial.find({
      relations: {
        supplier: true,
      },
    });
  }

  @Query(() => HydraulicMaterial, { nullable: true })
  async hydraulicMaterial(
    @Args("id", { type: () => ID })
    id: string,
  ) {
    return HydraulicMaterial.findOne({
      where: { id },
      relations: {
        supplier: true,
      },
    });
  }

  @Mutation(() => HydraulicMaterial)
  async createHydraulicMaterial(
    @Args("input", { type: () => CreateHydraulicMaterialInput })
    input: CreateHydraulicMaterialInput,
  ) {
    return HydraulicMaterial.create({
      ...input,
    }).save();
  }

  @Mutation(() => HydraulicMaterial, { nullable: true })
  async updateHydraulicMaterial(
    @Args("id", { type: () => ID })
    id: string,
    @Args("input", { type: () => CreateHydraulicMaterialInput })
    input: UpdateHydraulicMaterialInput,
  ) {
    const hydraulicMaterial = await HydraulicMaterial.findOne({
      where: { id },
    });
    if (!hydraulicMaterial) {
      return null;
    }
    Object.assign(hydraulicMaterial, input);
    return hydraulicMaterial.save();
  }

  @Mutation(() => Boolean)
  async deleteHydraulicMaterial(
    @Args("id", { type: () => ID })
    id: string,
  ) {
    try {
      await HydraulicMaterial.delete(id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
