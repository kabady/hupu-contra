import { CanShoot, ShootRelative } from "./canShoot";
import { Bullet } from "./game-object/bullet";

export interface CanShot {
    /**
     * 射击关系图
     * 
     * @type {Array<ShootRelative>}
     * @memberof CanShot
     */
    shootRelative: Array<ShootRelative>;
    /**
     * 被shooter射击到了，做什么（handle）
     * 
     * @param {CanShoot} shooter 
     * @param {() => void} handle 
     * @memberof CanShot
     */
    shot(shooter: CanShoot, handle: () => void): void;
    /**
     * 已经被WHO击中了
     * 
     * @param {CanShoot} who 
     * @param {Bullet} bullet 
     * @returns {hasBeenShot} 
     * @memberof CanShot
     */
    hasBeenShot(who: CanShoot, bullet: Bullet, pos: any): boolean;
}