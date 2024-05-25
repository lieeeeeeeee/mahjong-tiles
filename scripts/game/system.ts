import { Entity, Player, world } from "@minecraft/server";

const overWorld = world.getDimension("overworld");
function sendLog(level: string) {
  return function (color: string) {
    return function (message: string) {
      overWorld.runCommand(`tellraw @a[tag=op] {"rawtext":[{"text": "§o> §7[${color}${level}§7] ${message}"}]}`);
    }
  }
}
function sendScriptEvent(id: string) {
  return function (suffix: string) {
    return function (message: string) {
      overWorld.runCommand(`scriptevent ${id} ${suffix} ${message}`);
    }
  }
}

const sendMahjongEvent = sendScriptEvent("mahjong:event");
const sendMahjongProperty = sendScriptEvent("mahjong:property");

export const fireOnUseWinningStick = sendMahjongEvent("onInteractTileBlock");


export const sendDebugLog = sendLog("DEBUG")("§6");
export const sendInfoLog = sendLog("INFO")("§a");
export const sendWarnLog = sendLog("WARN")("§g");
export const sendErrorLog = sendLog("ERROR")("§4");


export function sendMessage(target: Entity, message: string) {
  const player = target as Player;
  if (!player) return;
  player.sendMessage(message);
}
