import { Entity, EquipmentSlot, ItemStack, world, Block } from "@minecraft/server";
import { getEquipments, getContainer, breakBlock } from "./world";
import { sendDebugLog, sendInfoLog, sendMessage, fireOnUseWinningStick } from "./system";
import { swapTileId, tileItemTag } from "../mahjong/tile";
import { Hand } from "../mahjong/hand";


function getDecoratedName(name: string) {
  return `§l§6${name}`;
}

export class Player {
  private readonly requiredHandCount = 13;
  private _object: Entity;
  private _name: string;
  private hand: Hand;
  private _isBreakingTile = true;

  private _canPickupTile = true;

  constructor(player: Entity, name: string) {
    this._object = player;
    this._name = name;
    this.hand = new Hand(player);
  }
  public get name() { return this._name; }
  public get decoratedName() { return getDecoratedName(this._name); }

  public setProperty(property: string, value: any) {
    sendInfoLog(`set player property: ${this._name}, ${property}, ${value}`);
    switch (property) {
      case "isDisplayingHand":
        this.hand.isDisplayed = value === "true";
        break;
      case "isSorttingHand":
        this.hand.isSorted = value === "true";
        break;
      case "isBreakingTile":
        this._isBreakingTile = value === "true";
        break;
      case "canPickupTile":
        this._canPickupTile = value === "true";
        break;
    }
  }
  
  public update() {
    this.hand.update();
  }

  public onInteractTileBlock(tileBlock: Block) {
    const tileBlockId = tileBlock.type.id;
    const mainHandItem = this.getMainHand();
    // not holding any item
    if (!mainHandItem) {
      if (!this._canPickupTile) return;
      this.getTile(swapTileId(tileBlockId));
    } 
    // holding any item
    else {
      const mainHandItemTags = mainHandItem.getTags();
      if (!mainHandItemTags || !mainHandItemTags.includes(tileItemTag)) {
        switch (mainHandItem.type.id) {
          case "mahjong:winning_stick":
            try {
              this.caluculatePoints(tileBlockId);
            } catch (error) {
              this.receiveMessage("§l§c手牌がアガリ形ではありません");
              sendDebugLog(`Player: ${this._name}, Error: ${error}`);
              fireOnUseWinningStick(this._name);
              break;
            }
            this.breakTile(tileBlock);
            break;
          default:
            return;
        }
      } else {
        this.swapTile(tileBlockId);
        this.breakTile(tileBlock);
      }
    }
  }
  private caluculatePoints(selectedTileBlockId: string) {
    const selectedTileItemId = swapTileId(selectedTileBlockId);
    const handLength = this.hand.tileIds.length;
    if (handLength !== this.requiredHandCount) { this.receiveMessage("§l§c手牌が13枚ではありません"); return; }
    const result = this.hand.getResult(false, selectedTileItemId);
    const resultJson = JSON.stringify(result);
    fireOnUseWinningStick(this._name + " " + resultJson);
  }
  private giveEquipment(item: ItemStack, slot: EquipmentSlot) {
    const equipment = getEquipments(this._object);
    equipment.setEquipment(slot, item);
  }
  private getMainHand() {
    const equipment = getEquipments(this._object);
    return equipment.getEquipment(EquipmentSlot.Mainhand);
  }
  private getTile(tileId: string) {
    const tileItem = new ItemStack(tileId, 1);
    const container = getContainer(this._object);
    container.addItem(tileItem);
  }
  private swapTile(selectedTileBlockId: string) {
    const selectedTileItemId = swapTileId(selectedTileBlockId);
    const selectedTileItem = new ItemStack(selectedTileItemId, 1);
    this.giveEquipment(selectedTileItem, EquipmentSlot.Mainhand);
  }
  private breakTile(tileBlock: Block) {
    if (this._isBreakingTile) breakBlock(tileBlock.location);
  }
  private receiveMessage(message: string) {
    sendMessage(this._object, message);
  }
}
export class Players extends Array<Player> {
  public getPlayer(name: string) {
    return this.find((player) => player.name === name);
  }
  public setProperty(property: string, target: string, value: any) {
    if (target === "@a") {
      this.forEach((player) => player.setProperty(property, value));
    } else {
      const player = this.getPlayer(target);
      if (player) player.setProperty(property, value);
    }
  }
}