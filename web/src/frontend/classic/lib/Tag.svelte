<script lang="ts">
    import { Tag } from 'carbon-components-svelte';
    import type { TagProps } from 'carbon-components-svelte/src/Tag/Tag.svelte';
    import { Tags } from '../../../engine/Tags';
    import type { IResource } from '../../../i18n/ILocale';
    import { Locale } from '../stores/Settings';

    export let label: keyof IResource;
    export let category: keyof IResource;
    export let filter = false;

    const colorTranslator: Map<keyof IResource, TagProps['type']> = new Map([
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
    <div class="tagContent {category} {$$props.class}">{$Locale[label]()}</div>
</Tag>

<style>
    /* TODO: How to get type safe from enum(string): ResourceKey.Tags_Language? */

    .tagContent {
        align-items: center;
        user-select: none;
    }
</style>
