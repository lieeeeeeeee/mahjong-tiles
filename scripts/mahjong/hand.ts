import { Shoupai, Util } from '@kobalab/majiang-core';
import { Entity } from "@minecraft/server";
import { formatDisplayId, formatSystemString, tileItemTag } from "./tile";
import { getContainer, displayActionbar } from "../game/world";

export class Hand {
  private readonly owner: Entity;
  private _tileIds: string[] = [];
  private _displayedStr: string = "";
  private _systemString: string = "";
  private _isDisplayed: boolean = true;
  private _isSorted: boolean = true;

  public constructor(owner: Entity) {
    this.owner = owner;
  }

  public get tileIds(): string[] { return this._tileIds; }
  public get displayedStr(): string { return this._displayedStr; }
  public set isDisplayed(value: boolean) { this._isDisplayed = value; }
  public set isSorted(value: boolean) { this._isSorted = value; }

  public update() {
    this.updateTiles();
    if (this._isDisplayed) this.display();
  }
  private updateTiles() {
    const tileIds = this.getTileIds();
    if (this._tileIds.join() === tileIds.join() && this._displayedStr === " ") return;
    this._tileIds = tileIds;
    if (this._isDisplayed) this._displayedStr = this.getDisplayedStr();
  }
  private getTileIds() {
    const container = getContainer(this.owner);
    const size = container.size;
    let tileIds: string[] = [];
    for (let i = 0; i < size; i++) {
      const item = container.getItem(i);
      const tags = item?.getTags();
      if (!item || !tags || !tags.includes(tileItemTag)) continue;
      const tileId = item.type.id;
      tileIds.push(tileId);
    }
    return tileIds;
  }
  private getDisplayedStr() {
    return this.formatDisplayIds(this._isSorted ? this.sortTileIds() : this._tileIds);
  }
  private display() {
    displayActionbar(this.owner, this._displayedStr);
  }
  private formatDisplayIds(tileIds: string[]): string {
    return tileIds.map((tileId) => formatDisplayId(tileId)).join("");
  }
  private sortTileIds(): string[] {
    return this._tileIds.sort((a, b) => a.localeCompare(b));
  } 
  public getResult(isRiichi: boolean, winningTileId: string): any {
    const tileIds = this.sortTileIds().concat(winningTileId);
    const systemString = formatSystemString(tileIds);
    const shoupai = Shoupai.fromString(systemString);
    const param = Util.hule_param({
      zhuangfeng: 0,
      menfeng: 1,
      lizhi: isRiichi ? 1 : 0,
      yifa: false,
      qianggang: false,
      lingshang: false,
      haidi: 0,
      tianhu: 0,
      baopai: [],
      fubaopai: null,
      changbang: 0,
      lizhibang: 0
    });
    return Util.hule(shoupai, "", param);
  }
}