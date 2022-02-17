"use strict";

const express = require("express");
const { BadRequestError } = require("./expressError");
const db = require("./fakeDb");
const router = new express.Router();

/** return list of shopping item objects =>
 * { items: [
 * { name: "popsicle", price: 1.45 },
 * { name: "cheerios", price: 3.40 }
 * ]}
*/
router.get("/", function (req, resp) {
  return resp.send(db.items);
});

//CR: try out .find method
/** return single item */
router.get("/:name", function (req, resp) {
  let itemNameValue = req.params.name;
  for (let item of db.items) {
    if (item.name === itemNameValue) {
      return resp.send(item);
    }
  }
  throw new BadRequestError(
    `It's a bad request, ${itemNameValue} is not in the list!`);
});

//CR: destructure the body and re-add name & price
/** accept JSON body, add item, and return it ==>
 * {name: "popsicle", price: 1.45} =>
 * {added: {name: "popsicle", price: 1.45}}
*/
router.post("/", function (req, resp) {
  db.items.push(req.body);
  return resp.send({
    added: req.body,
  });
});

/** accept JSON body, modify item, return it */
router.patch("/:name", function (req, resp) {
  const itemNameValue = req.params.name;
  const updateValues = req.body;

  for (let item of db.items) {
    if (item.name === itemNameValue) {
      item.name = updateValues.name;
      item.price = updateValues.price;
      return resp.send(
        {
          updated: item
        });
    }
  }
  throw new BadRequestError(
    `It's a bad request, ${itemNameValue} is not in the list!`);
});

/** delete item */
router.delete("/:name", function (req, resp) {
  const itemNameValue = req.params.name;

  for (let item of db.items) {
    if (item.name === itemNameValue) {
      const itemIndex = db.items.indexOf(item);
      db.items.splice(itemIndex, 1);
      return resp.send({ message: "Deleted" });
    }
  }
  throw new BadRequestError(
    `It's a bad request, ${itemNameValue} is not in the list!`);
});

module.exports = router;