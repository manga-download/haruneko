<script lang="ts">
    import { Tag } from 'carbon-components-svelte';
    import type { TagProps } from 'carbon-components-svelte/types/Tag/Tag.svelte';
    import { Tags } from '../../../engine/Tags';
    import type { ResourceKey } from '../../../i18n/ILocale';
    import { LocaleValue } from '../SettingsStore';

    export let label: ResourceKey;
    export let category: ResourceKey;
    export let filter = false;

    const colorTranslator: Map<ResourceKey, TagProps['type']> = new Map([
        [Tags.Language.Title, 'cyan'],
        [Tags.Media.Title, 'magenta'],
        [Tags.Source.Title, 'teal'],
    ]);
    let color: TagProps['type'] = 'gray';
    $: color = colorTranslator.has(category)
        ? colorTranslator.get(category)
        : color;
</script>

<Tag {filter} type={color} on:click>
    <div class="tagContent {category}">{$LocaleValue[label]()}</div>
</Tag>

<style>
    /* TODO: How to get type safe from enum(string): ResourceKey.Tags_Language? */
    .Tags_Language {
        font-family: BabelStoneFlags;
    }
    .tagContent {
        display: flex;
        align-items: center;
        user-select: none;
    }
</style>
