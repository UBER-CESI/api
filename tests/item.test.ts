import axios from "axios";
import { expect } from "chai";
import { IItem } from "../src/model/menu";
import "mocha";
import { Types } from "mongoose";
export default function suite() {
  const listen_address =
    process.env.LISTEN_ADDRESS + ":" + process.env.LISTEN_PORT;
  var restaurantId: Types.ObjectId;
  var restaurant = {
    name: "mochaResto",
    address: "32 rue truc 33300 Bordeaux",
    phoneNumber: "0666666666",
    email: "mochaResto@restaurant.com",
  };
  var sampleMenuItem: IItem;
  var itemId: Types.ObjectId;
  before(() => {
    var config = {
      method: "put",
      url: "http://" + listen_address + "/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(restaurant),
    };

    return axios(config).then(function (response) {
      expect(response.status).to.equal(201);
      restaurantId = new Types.ObjectId(response.data._id);
      sampleMenuItem = {
        name: "steak",
        description: "Oui blablabla",
        allergens: ["vegan"],
        restaurantId,
      };
    });
  });
  it("Create an Item", function () {
    var config = {
      method: "put",
      url: "http://" + listen_address + `/${restaurantId}/item/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(sampleMenuItem),
    };
    return axios(config).then(function (response) {
      expect(response.status).to.equal(201);
      itemId = response.data._id;
    });
  });
  it("Get the Item", function () {
    var config = {
      method: "get",
      url: "http://" + listen_address + `/${restaurantId}/item/` + itemId,
    };
    return axios(config).then(function (response) {
      expect(response.data.name).to.equal(sampleMenuItem.name);
      expect(response.data.description).to.equal(sampleMenuItem.description);
      expect(response.data.allergens).to.eql(sampleMenuItem.allergens);
      expect(response.data.restaurantId).to.equal(
        sampleMenuItem.restaurantId.toString()
      );
      expect(response.status).to.equal(200);
    });
  });
  it("Edit the Item", function () {
    sampleMenuItem.description = "blablabla but edited";
    var config = {
      method: "post",
      url: "http://" + listen_address + `/${restaurantId}/item/` + itemId,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(sampleMenuItem),
    };
    return axios(config).then(function (response) {
      expect(response.status).to.equal(200);
      itemId = response.data._id;
    });
  });
  it("Check that Item is edited", function () {
    var config = {
      method: "get",
      url: "http://" + listen_address + `/${restaurantId}/item/` + itemId,
    };
    return axios(config).then(function (response) {
      expect(response.data.name).to.equal(sampleMenuItem.name);
      expect(response.data.description).to.equal(sampleMenuItem.description);
      expect(response.data.allergens).to.eql(sampleMenuItem.allergens);
      expect(response.data.restaurantId).to.equal(
        sampleMenuItem.restaurantId.toString()
      );
      expect(response.status).to.equal(200);
    });
  });
  it("Delete the Item", function () {
    var config = {
      method: "delete",
      url: "http://" + listen_address + `/${restaurantId}/item/` + itemId,
    };
    return axios(config).then(function (response) {
      expect(response.status).to.equal(200);
    });
  });
  it("Check that item is deleted", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + `/${restaurantId}/item/` + itemId,
      headers: {},
    };

    return axios(config)
      .then(function (response) {
        expect(response.status).to.equal(404);
      })
      .catch(function (error) {
        expect(error.response.status).to.equal(404);
      });
  });
  after(() => {
    var config = {
      method: "delete",
      url: "http://" + listen_address + "/" + restaurantId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data._id).to.equal(restaurantId.toString());
      expect(response.data.email).to.equal(restaurant.email);
      expect(response.data.name).to.equal(restaurant.name);
      expect(response.data.phoneNumber).to.equal(restaurant.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
}
