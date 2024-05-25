import { world, Entity, EntityInventoryComponent, EntityEquippableComponent, Container, EntityComponentTypes } from "@minecraft/server";

const overWorld = world.getDimension("overworld");

type Block = {  
  location: { x: number, y: number, z: number },
  type: { id: string }
}

export function getEquipments(entity: Entity): EntityEquippableComponent {
  return entity.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
}
export function getInventory(entity: Entity): EntityInventoryComponent {
  return entity.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
}

export function getContainer(entity: Entity): Container {
  return getInventory(entity).container as Container;
}

export function displayActionbar(player: Entity, message: string) {
  player.runCommand(`/titleraw @s actionbar {"rawtext":[{"text":"${message}"}]}`);
}

export function getPlayer(name: string): Entity {
  return world.getPlayers().find((player) => player.name === name) as Entity;
}

export function setBlock(block: Block) {
  overWorld.runCommand(`setblock ${block.location.x} ${block.location.y} ${block.location.z} ${block.type.id}`);
}
export function breakBlock(blockLocation: { x: number, y: number, z: number }) {
  const air: Block = { location: blockLocation, type: { id: "minecraft:air" } };
  overWorld.playSound("dig.wood", blockLocation);
  setBlock(air);
}
