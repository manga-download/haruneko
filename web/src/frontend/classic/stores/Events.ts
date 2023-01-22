import { type Readable, readable } from 'svelte/store';
import type { Event } from '../../../engine/Event';

export function EventWatcher<TSender, TArgs>(intitalvalue: TArgs, event: Event<TSender, TArgs>, scope?:TArgs): Readable<TArgs> {
    return readable<TArgs>(intitalvalue, set => {
        set(intitalvalue);

        const callback = (_sender: TSender, value: TArgs) => {
            const ignore = scope ? value !== scope : false;
            if (!ignore) set(value);
        };
        event.Subscribe(callback);
        return () => event.Unsubscribe(callback);
    });
}
