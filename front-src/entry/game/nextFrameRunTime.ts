export interface NextFrameRunTime{
    nextFrameRunList: Array<()=>void>;
    nextFrameRun(): void;
    setNextFrameRun(handle: ()=> void): void;
}