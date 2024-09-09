import type { MediaContainer, MediaChild } from '../../engine/providers/MediaPlugin';

/**
 * An alias for nested media containers with at least one hierarchical level
 */
export type MediaContainer1 = MediaContainer<MediaChild>;

/**
 * An alias for nested media containers with at least two hierarchical levels
 */
export type MediaContainer2 = MediaContainer<MediaContainer<MediaChild>>;