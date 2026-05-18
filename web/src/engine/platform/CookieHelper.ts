export function ParseCookiesFromHeader(cookies: string): CookieList {
    return cookies
        .split(';')
        .filter(cookie => cookie.includes('='))
        .map(cookie => cookie.split('='))
        .map(([name, value]) => ({ name: name.trim(), value: value.trim() }))
        .filter(({ name, value }) => name && value);
}

export function MergeCookiesIntoHeader(...cookieSets: CookieList[]): string {
    const result: Record<string, string> = {};
    for (const cookieSet of cookieSets) {
        for (const { name, value } of cookieSet) {
            if(name && value) result[name] = value;
        }
    }
    return Object.entries(result).map(([ name, value ]) => `${name}=${value}`).join('; '); // TODO: Maybe use `encodeURIComponent(cookie.value)`
}