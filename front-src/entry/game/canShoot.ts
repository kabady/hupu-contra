import { CanShot } from "./canShot";
import { Bullet } from "./game-object/bullet";
export class ShootRelative{
	from: CanShoot;
	to: CanShot;
	handle: (bullet: Bullet) => void;
}
export interface CanShoot{
	/**
	 * 射击关系
	 * 
	 * @type {Array<ShootRelative>}
	 * @memberof CanShoot
	 */
	shootRelative: Array<ShootRelative>;
	/**
	 * who被射击到了，做什么（handle）
	 * 
	 * @param {CanShot} who 
	 * @param {() => void} handle 
	 * @memberof CanShoot
	 */
	shootSomeOne(who: CanShot, handle: (bullet: Bullet) => void): void;
	/**
	 * 发射子弹 @Deprecated
	 * 
	 * @param {(bullets: Array<Bullet>) => void} handle 
	 * @memberof CanShoot
	 */
	shoot(handle: (bullets: Array<Bullet>) => void): void;
	/**
	 * 发射子弹
	 * 
	 * @memberof CanShoot
	 */
	shoot(): void;
	/**
	 * 子弹数组
	 * 
	 * @type {Array<Bullet>}
	 * @memberof CanShoot
	 */
	bullets: Array<Bullet>;
	/**
	 * 从子弹从属的物体中删除子弹
	 * 
	 * @param {Bullet} bullet 
	 * @memberof CanShoot
	 */
	removeBullet(bullet: Bullet): void;

	// WHO 已经被击中了
	hasShot(who: CanShot, bullet: Bullet): void;
}