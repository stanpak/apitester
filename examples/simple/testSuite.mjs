
import { fetchDelete, fetchGet, fetchPost } from "../../framework/rest.mjs";
import * as assert from "../../framework/assert.mjs";


// NOTE: This constant corresponds to the test suite class in JUnit
const simpleTestSuite = {

    // NOTE: This property corresponds to the singular test method in JUnit
    getCall: async (env) => {

        // Execute the REST call
        let data = await fetchGet({
            url: env.uri + "/users?page=2",
            proxy: env.proxy
        });

        // Here we can do some basic checks of the response..
        // console.log({ data });
        assert.isTrue(data != null, "The response cannot be null");
        assert.isTrue(false, "No good!");
    },

    // NOTE: This property corresponds to the singular test method in JUnit
    postCall: async (env) => {

        // Execute the REST call
        let payload = {
            name: "morpheus",
            job: "leader"
        };
        let data = await fetchPost({
            url: env.uri + "/users",
            body: payload,
            proxy: env.proxy
        });

        // Here we can do some basic checks of the response..
        // console.log({ data });
    },

    // NOTE: This property corresponds to the singular test method in JUnit
    deleteCall: async (env) => {

        // Execute the REST call
        let data = await fetchDelete({
            url: env.uri + "/users/2",
            proxy: env.proxy
        });

        // Here we can do some basic checks of the response..
        // console.log({ data });
    },

    // Test to see how the exception will be handled.
    throwsEx: async (env) => {
        throw "Exception thrown!";
    },
}

export { simpleTestSuite };