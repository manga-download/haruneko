export class ImageLinkDeProxifier {

    private DeProxifyGoogle(uri: URL): string {
        const source = uri.searchParams.get('url');
        if(source) {
            return source;
        };
        throw new Error(`Missing parameter <url> in '${uri.href}' for Google proxy!`);
    }

    private DeProxifyPhoton(uri: URL): string {
        let url = uri.searchParams.get('ssl') ? 'https://' : 'http://';
        url += uri.pathname.slice(1);
        let search = uri.searchParams.get('q');
        if(search) {
            url += '?' + search;
        }
        return url;
    }

    public Convert(url: string): string {
        let uri = new URL(url);
        if(/googleusercontent\.com$/.test(uri.hostname) && /\/proxy$/.test(uri.pathname)) {
            return this.DeProxifyGoogle(uri);
        }
        if(/i\d+\.wp\.com$/.test(uri.hostname)) {
            return this.DeProxifyPhoton(uri);
        }
        return url;
    }
}