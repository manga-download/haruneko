function DeProxifyGoogle(uri: URL): URL {
    const source = uri.searchParams.get('url') || '';
    return new URL(source);
}

function DeProxifyPhoton(uri: URL): URL {
    let url = uri.searchParams.get('ssl') ? 'https://' : 'http://';
    url += uri.pathname.slice(1);
    const search = uri.searchParams.get('q');
    if(search) {
        url += '?' + search;
    }
    return new URL(url);
}

function DeProxifyWordPressPassthru(uri: URL): URL {
    const url = uri.searchParams.get('src') || '';
    return new URL(url);
}

export default function DeProxify(uri: URL): URL {
    if(/googleusercontent\.com$/.test(uri.hostname) && /\/proxy$/.test(uri.pathname)) {
        return DeProxifyGoogle(uri);
    }
    if(/i\d+\.wp\.com$/.test(uri.hostname)) {
        return DeProxifyPhoton(uri);
    }
    if(/webpc-passthru\.php/.test(uri.pathname)) {
        return DeProxifyWordPressPassthru(uri);
    }
    return uri;
}