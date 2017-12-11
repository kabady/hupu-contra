import { CanShot } from "./canShot";

export interface CanShoot{
	// who被射击到了，做什么（handle）
	shootSomeOne(who: CanShot, handle: () => void): void;
	shoot(handle: (bullets: Array<createjs.DisplayObject>) => void): void;
}