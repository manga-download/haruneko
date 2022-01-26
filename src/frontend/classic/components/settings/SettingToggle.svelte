<script lang="ts">
    import type { SettingValidator } from '../../utils/storage';
    import type { Writable } from 'svelte/store';
    import { Toggle } from 'carbon-components-svelte';
    import { updateStoreValue } from '../../utils/storage';

    export let store: Writable<boolean>;
    export let storageKey: string;

    const validator: SettingValidator = undefined;
</script>

<Toggle
    toggled={$store}
    on:toggle={({ detail }) =>
        updateStoreValue(store, storageKey, detail.toggled, validator)}
/>
