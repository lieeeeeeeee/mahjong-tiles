import { system, world, Entity, EquipmentSlot, ItemStack } from "@minecraft/server";
import { Player, Players } from "./game/player";  
import {  } from "./game/world";
import { sendInfoLog } from "./game/system";
import { tileBlockTag } from "./mahjong/tile";


let players: Players = new Players();
let waitingList: string[] = [];

system.runInterval(() => {
  players.forEach((player) => { player.update(); });
});


// Join and leave events
world.afterEvents.playerJoin.subscribe((event) => {
    const playerName = event.playerName;
    waitingList.push(playerName);
});
world.afterEvents.playerLeave.subscribe((event) => {
    const playerName = event.playerName;
    const playerIdx = players.findIndex((player) => player.name === playerName);
    if (playerIdx) players.splice(playerIdx, 1);
});

// Player spawn event
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player
  const playerName = event.player.name;
  // If the player is in the waiting list
  if (waitingList.includes(playerName)) {
    const p = new Player(player as Entity, playerName);
    players.push(p);
  }
});

// Script event receive event
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const id = event.id;
  const command = event.message.split(" ");
  const sourceEntity = event.sourceEntity;
  sendInfoLog(`script event: ${id}, ${event.message}`);
  switch (id) {
    case "mahjong:event": {
      const eventName = command[0];
      switch (eventName) {
        default: break;
      } 
      break;
    }
    case "mahjong:property": {
      const key = command[0];
      switch (key) {
        case "isDisplayingHand": 
        case "isSorttingHand":
        case "isBreakingTile":
        case "canPickupTile":
          players.setProperty(key, command[1], command[2]); break; // command[1] is player name, command[2] is value
        default: break;
      }
      break;
    }
  }
});

// Player interact with block event
world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const player = players.getPlayer(event.player.name);
  if (!player) return;
  const block = event.block;
  const blockTags = block.getTags();
  sendInfoLog(`player: ${player.name}, block: ${block.typeId}`);
  blockTags.forEach((tag) => {
    switch (tag) {
      case tileBlockTag:
        player.onInteractTileBlock(block);
        break;
      default: break;
    }
  });
});