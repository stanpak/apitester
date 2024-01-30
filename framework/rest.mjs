import fetch from "node-fetch";

/**
 * Default REST headers: using JSON for everything.
 */
const options = { headers: { 'Content-Type': 'application/json' } }

async function _fetch({ method, url, body, headers }) {
    url = encodeURI(url);

    let h = {
        ...options.headers,
        ...headers,
    };

    let b = body ? JSON.stringify(body) : null;

    let response = await fetch(url, {
        ...options,
        method,
        body: b,
        headers: h
    });

    let data = null;
    let text = await response.text();
    text = text.trim();
    if (text.length !== 0)
        data = JSON.parse(text);

    return data;
}

export async function fetchPost(url, body, headers) {
    return await _fetch({ method: "post", url, body, headers });
}

export async function fetchPut(url, body, headers) {
    return await _fetch({ method: "put", url, body, headers });
}

export async function fetchGet(url, headers) {
    return await _fetch({ method: "get", url, body: undefined, headers });
}

export async function fetchDelete(url, headers) {
    return await _fetch({ method: "delete", url, body: undefined, headers });
}

