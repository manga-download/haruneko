function DeProxifyGoogle(uri: URL): URL {
    const source = uri.searchParams.get('url') || '';
    return new URL(source);
}

function DeProxifyPhoton(uri: URL): URL {
    let url = !uri.searchParams.has('ssl') ? `${uri.protocol}//` : uri.searchParams.get('ssl') === '1' ? 'https://' : 'http://';
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

function DeProxifyStatically(uri: URL): URL {
    const url = uri.href
        // NOTE: The indonesian developer of statically.io (Frans Allen) seems to be affiliated with BacaKomik
        //       and added support for some kind of optional URL branding => remove known brands from URL
        .replace(/cdn\.statically\.io\/img\/(bacakomik\/)?/, '')
        .replace(/\/(w=\d+|h=\d+|q=\d+|f=auto)(,(w=\d+|h=\d+|q=\d+|f=auto))*\//, '/');
    return new URL(url);
}

export default function DeProxify(uri: URL): URL {
    if (/googleusercontent\.com$/.test(uri.hostname) && /\/proxy$/.test(uri.pathname)) {
        return DeProxifyGoogle(uri);
    }
    if (/i\d+\.wp\.com$/.test(uri.hostname)) {
        return DeProxifyPhoton(uri);
    }
    if (/webpc-passthru\.php/.test(uri.pathname)) {
        return DeProxifyWordPressPassthru(uri);
    }
    if (/cdn\.statically\.io\/img\//.test(uri.href)) {
        return DeProxifyStatically(uri);
    }

    return uri;
}