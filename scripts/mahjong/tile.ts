enum Color { gray = "§7", blue = "§9", green = "§a", red = "§c", white = "§f" }
type Frature = { systemType: string, displayType: string, jpIndex: string, systemIndex: string };

const windDisplayIndex = { east: "0", south: "1", west: "2", north: "3" };
const windSystemIndex = { east: "1", south: "2", west: "3", north: "4" };
const dragonDisplayIndex = { green: "4", white: "5", red: "6" };
const dragonSystemIndex = { green: "5", white: "6", red: "7" };


function getFeature(tileId: string): Frature {
  const tileName = tileId.replace("mahjong:tile_", "").replace("_block", "").replace("_item", "");
  const tileType = tileName.split("_")[0];
  const tileIndex = tileName.replace(tileType + "_", "");

  let feature: Frature = { systemType: "", displayType: "", jpIndex: "", systemIndex: "" };
  switch (tileType) {
    case "bamboo": feature = { systemType: "s", displayType: "c", jpIndex: tileIndex, systemIndex: tileIndex }; break;
    case "circle": feature = { systemType: "p", displayType: "d", jpIndex: tileIndex, systemIndex: tileIndex }; break;
    case "character": feature = { systemType: "m", displayType: "e", jpIndex: tileIndex, systemIndex: tileIndex }; break;
    case "wind": 
      feature = { systemType: "z", displayType: "f", jpIndex: "", systemIndex: "" };
      switch (tileIndex) {
        case "east": feature.jpIndex = windDisplayIndex.east; feature.systemIndex = windSystemIndex.east; break;
        case "south": feature.jpIndex = windDisplayIndex.south; feature.systemIndex = windSystemIndex.south; break;
        case "west": feature.jpIndex = windDisplayIndex.west; feature.systemIndex = windSystemIndex.west; break;
        case "north": feature.jpIndex = windDisplayIndex.north; feature.systemIndex = windSystemIndex.north; break;
      } break;
    case "dragon":
      feature = { systemType: "z", displayType: "f", jpIndex: "", systemIndex: "" };
      switch (tileIndex) {
        case "white": feature.jpIndex = dragonDisplayIndex.white; feature.systemIndex = dragonSystemIndex.white; break;
        case "green": feature.jpIndex = dragonDisplayIndex.green; feature.systemIndex = dragonSystemIndex.green; break;
        case "red": feature.jpIndex = dragonDisplayIndex.red; feature.systemIndex = dragonSystemIndex.red; break;
      } break;
  }
    
  if (tileIndex.includes("5_red")) { feature.jpIndex = "0", feature.systemIndex = "0"; }

  return feature;
}
export function formatDisplayId(tileId: string): string {
  const feature = getFeature(tileId);
  let prefixSpace = "";
  let suffixSpace = "";

  if (feature.jpIndex === "0") { prefixSpace = "  "; }
  if (feature.jpIndex === "2") { suffixSpace = " "; }
  if (feature.jpIndex === "3") { prefixSpace = "   "; }
  if (feature.jpIndex === "4") { suffixSpace = "   "; }
  if (feature.jpIndex === "7") { suffixSpace = "  "; }
  if (feature.jpIndex === "8") { prefixSpace = "  "; }
  if (feature.displayType === "c") {
    if (feature.jpIndex === "7") { suffixSpace = " "; }
    if (feature.jpIndex === "9") { suffixSpace = "    "; }
  }


  
  return prefixSpace + "\\ue1" + feature.displayType + feature.jpIndex + suffixSpace;
}
export function formatSystemString(tileIds: string[]): string {
  let str = "";
  let type = "";
  tileIds.forEach((tileId) => {
    const feature = getFeature(tileId);
    const tileType = feature.systemType;
    const tileIndex = feature.systemIndex;
    if (type !== tileType) {
      type = tileType;
      str += type;
    }
    str += tileIndex;
  });
  return str;
}
export function swapTileId(tileId: string): string {
  const id = tileId;
  if (id.includes("_block")) return id.replace("_block", "_item");
  if (id.includes("_item")) return id.replace("_item", "_block");
  return id;
}

export const tileItemTag = "mahjong:tile_item";
export const tileBlockTag = "mahjong:tile_block";

