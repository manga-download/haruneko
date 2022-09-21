import { type Readable, readable } from 'svelte/store';
import type { Event } from '../../../engine/Event';

export function EventWatcher<TSender, TArgs>(intitalvalue: TArgs, event: Event<TSender, TArgs>, scope?:TArgs): Readable<TArgs> {
    return readable<TArgs>(intitalvalue, set => {
        set(intitalvalue);
        const callback = (sender: TSender, value: TArgs) => {
            console.log('should ignore?',scope,value);
            const ignore = scope ? value !== scope : false;
            if (!ignore) set(value);
        };
        event.Subscribe(callback);
        return () => event.Unsubscribe(callback);
    });
}
