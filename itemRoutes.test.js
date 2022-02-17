"use strict";

const request = require("supertest");
const itemRoutes = require("./itemRoutes");
const db = require("./fakeDb");
const app = require("./app");

/** Because we use fake database, the data will not be changed or updated, 
 *  so we will not use beforeEach and afterEach function here.
 */

// Just documentation in the string.

/** Gets all items */
describe("GET /items", function () {
    it("Gets a food list", async function () {
        // full URL w/o localhost stuff
        const resp = await request(app).get("/items");

        expect(resp.body).toEqual([
            { name: "popsicle", price: 1.45 },
            { name: "cheerios", price: 3.40 }
        ]);
    });
});

/** added an item */
describe("POST /items", function () {
    it("Adds an item to the food list", async function () {
        const resp = await request(app).post("/items").send({
            name: "cookies",
            price: 10000,
        });

        expect(resp.body).toEqual({
            added: {
                name: "cookies",
                price: 10000,
            }
        });
    });
});

/** gets a specific item */
describe("GET /items/:name", function () {
    it("Gets a specific item", async function () {
        const resp = await request(app).get("/items/popsicle");

        expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
    });
    //CR: fail condition tests are important too!
    it("Fails to get a specific item", async function () {
        const resp = await request(app).get("/items/pizza");

        expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
    });
});

/** Updates a specific item */
describe("PATCH /items/:name", function () {
    it("Updates a specific item", async function () {
        const resp = await (await request(app)
            .patch("/items/popsicle")
            .send({ name: "Mega popsicle", price: 145 }));

        expect(resp.body).toEqual({ updated: { name: "Mega popsicle", price: 145 } });
    });
});

/** deletes an item */
describe("DELETE /items/:name", function () {
    it("DELETE a specific item", async function () {
        const resp = await request(app).delete("/items/cheerios");

        expect(resp.body).toEqual({ message: "Deleted" });
    });
});
