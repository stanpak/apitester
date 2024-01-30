
const failedAssertions = {};
const currentTest = {
    suite: null,
    test: null,
};

function assertionFailed(message) {
    console.error(message);

    let suiteInfo = failedAssertions[currentTest.suite];
    if (!suiteInfo) {
        suiteInfo = {
            name: currentTest.suite,
            tests: {}
        };
        failedAssertions[currentTest.suite] = suiteInfo;
    }

    let testInfo = suiteInfo.tests[currentTest.test];
    if (!testInfo) {
        testInfo = {
            name: currentTest.test,
            assertions: [],
        };
        suiteInfo.tests[currentTest.test] = testInfo;
    }

    testInfo.assertions.push({
        message
    });
}

export function testStarted(suite, test) {
    currentTest.suite = suite;
    currentTest.test = test;
}

export function isTrue(condition, message) {
    // TODO it needs to collect these assertion messages into a collection and then report as failed test.
    if (!condition) {
        assertionFailed(message);
    }
}
