import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

/**
 * Default REST headers: using JSON for everything.
 */
const options = { headers: { 'Content-Type': 'application/json' } }

async function _fetch({ method, url, body, text, headers, proxy }) {
    url = encodeURI(url);

    let h = {
        ...options.headers,
        ...headers,
    };

    let b = body ? JSON.stringify(body) : null;
    if (text)
        b = text;

    let opt = {
        ...options,
        method,
        body: b,
        headers: h
    };

    // Add the web proxy configuration if it is expected...
    if (proxy) {
        const proxyAgent = new HttpsProxyAgent(proxy.url)
        opt.agent = proxyAgent;
    }

    let response = await fetch(url, opt);

    let data = null;
    let t = await response.text();
    t = t.trim();
    if (t.length !== 0)
        data = JSON.parse(t);

    return data;
}

export async function fetchPost(p) {
    return await _fetch({ method: "post", ...p });
}

export async function fetchPut(p) {
    return await _fetch({ method: "put", ...p });
}

export async function fetchGet(p) {
    return await _fetch({ method: "get", ...p, body: undefined });
}

export async function fetchDelete(p) {
    return await _fetch({ method: "delete", ...p, body: undefined });
}

