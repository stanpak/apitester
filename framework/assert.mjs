import { assertionFailed } from "./framework.mjs";

export function isTrue(condition, message) {
    // TODO it needs to collect these assertion messages into a collection and then report as failed test.
    if (!condition) {
        assertionFailed(message);
    }
}

export function mustThrow(fn, message) {
    try {
        fn();
        assertionFailed(message);
    }
    catch (err) {
        // This is the expected behavior.
    }
}
