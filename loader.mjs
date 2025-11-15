/**
 * Custom ESM loader for handling asset files (.webp, .png, .proto, etc.)
 * Returns empty string for asset imports since they're not needed in API mode
 */

const ASSET_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.proto'];

export async function load(url, context, nextLoad) {
    // Strip query parameters to check the actual file extension
    const urlWithoutQuery = url.split('?')[0];

    // Check if it's an asset file
    const isAsset = ASSET_EXTENSIONS.some(ext => urlWithoutQuery.endsWith(ext));

    if (isAsset) {
        // Return an empty string as the source
        return {
            format: 'module',
            source: 'export default "";',
            shortCircuit: true
        };
    }

    return nextLoad(url, context);
}
