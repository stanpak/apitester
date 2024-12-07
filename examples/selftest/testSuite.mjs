
import * as assert from "../../framework/assert.mjs";


// NOTE: This constant corresponds to the test suite class in JUnit
export const selfTest = {

    // Test to see how the exception will be handled.
    throwsExError: async (env) => {
        throw Error("Exception should be thrown! Expect the error in the test results.");
    },

    // Test to see how the exception will be handled in the case the exception is the expected result.
    throwsExOK: async (env) => {
        assert.mustThrow(
            () => {
                throw Error("Exception thrown!")
            },
            "Must throw an exception!");
    },

    assertions: async (env) => {
        assert.isTrue(false, "There should be the assertion in the test results.");
    },

    ok: async (env) => {
        assert.isTrue(true, "There should be NO assertions in the test results.");
    },
}
