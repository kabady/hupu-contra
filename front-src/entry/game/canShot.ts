import { CanShoot } from "./canShoot";

export interface CanShot{
    // 被shooter射击到了，做什么（handle）
    shot(shooter: CanShoot, handle: () => void): void;
}