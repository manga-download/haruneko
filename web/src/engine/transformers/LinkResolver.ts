export class LinkResolver {

    private readonly _roots: URL[];

    constructor(...roots: string[]) {
        this._roots = roots.map(root => new URL(root));
    }

    public GetRelativeOrAbsolutePath(url: string): string {
        const uri = new URL(url);
        if(this._roots.some(root => root.origin === uri.origin)) {
            return uri.pathname + uri.search;
        } else {
            return uri.href;
        }
    }

    public GetAbsolutePath(path: string, origin: string): string {
        const uri = new URL(path, origin);
        if(this._roots.some(root => root.origin === uri.origin)) {
            return new URL(uri.pathname + uri.search, origin).href;
        } else {
            return uri.href;
        }
    }
}