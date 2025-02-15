import { vi } from 'vitest';
import './src/engine/ArrayExtensions';

vi.mock('./src/engine/BackgroundTimers', () => ({
    SetTimeout: setTimeout,
    ClearTimeout: clearTimeout,
    SetInterval: setInterval,
    ClearInterval: clearInterval,
    Delay: (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)),
}));