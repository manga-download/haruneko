export const enum SampleWorkerAction {
    Multiply = 'Multiply',
    Divide = 'Divide',
}

export interface SampleWorkerProxy {
    PostMessage(action: SampleWorkerAction.Multiply, payload: { a: number, b: number }): Promise<number>;
    PostMessage(action: SampleWorkerAction.Divide, payload: { a: number, b: number }): Promise<number>;
}