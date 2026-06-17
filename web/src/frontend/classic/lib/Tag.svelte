<script lang="ts">
    import { Tag } from 'carbon-components-svelte';
    import type { TagProps } from 'carbon-components-svelte/src/Tag/Tag.svelte';
    import { Tags } from '../../../engine/Tags';
    import type { IResource } from '../../../i18n/ILocale';
    import { GlobalSettings } from '../stores/Settings.svelte';

    interface Props {
        label: keyof IResource;
        category: keyof IResource;
        filter?: boolean;
        class?: string;
    }

    let { label, category, filter = false, class: className = ''}: Props = $props();

    const colorTranslator: Map<keyof IResource, TagProps['type']> = new Map([
        [Tags.Language.Title, 'cyan'],
        [Tags.Media.Title, 'magenta'],
        [Tags.Source.Title, 'teal'],
    ]);
    let color: TagProps['type'] = $derived(colorTranslator.has(category)? colorTranslator.get(category) : 'gray');
</script>

<Tag {filter} type={color} on:click on:close>
    <div class="tagContent {category} {className}">{GlobalSettings.Locale[label]()}</div>
</Tag>

<style>
    /* TODO: How to get type safe from enum(string): ResourceKey.Tags_Language? */

    .tagContent {
        align-items: center;
        user-select: none;
    }
</style>