import axios from "axios";
import { expect } from "chai";
import { IMenu } from "../src/model/menu";
import { Types } from "mongoose";
import "mocha";

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
  var sampleMenu: IMenu;
  var menuId: String;
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
      sampleMenu = {
        name: "steak",
        description: "Oui blablabla",
        items: ["item01"],
        price: 8,
        restaurantId,
      };
    });
  });
  it("Create a Menu", function () {
    var config = {
      method: "put",
      url: "http://" + listen_address + "/menu",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(sampleMenu),
    };
    return axios(config).then(function (response) {
      expect(response.status).to.equal(201);
      menuId = response.data._id;
    });
  });
  it("Get the Menu", function () {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/menu/" + menuId,
    };
    return axios(config).then(function (response) {
      expect(response.data.name).to.equal(sampleMenu.name);
      expect(response.data.description).to.equal(sampleMenu.description);
      expect(response.data.items).to.eql(sampleMenu.items);
      expect(response.data.restaurantId).to.equal(
        sampleMenu.restaurantId.toString()
      );
      expect(response.status).to.equal(200);
    });
  });
  it("Edit the Menu", function () {
    sampleMenu.description = "blablabla but edited";
    var config = {
      method: "post",
      url: "http://" + listen_address + "/menu/" + menuId,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(sampleMenu),
    };
    return axios(config).then(function (response) {
      expect(response.status).to.equal(200);
      menuId = response.data._id;
    });
  });
  it("Check that Menu is edited", function () {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/menu/" + menuId,
    };
    return axios(config).then(function (response) {
      expect(response.data.name).to.equal(sampleMenu.name);
      expect(response.data.description).to.equal(sampleMenu.description);
      expect(response.data.items).to.eql(sampleMenu.items);
      expect(response.data.restaurantId).to.equal(
        sampleMenu.restaurantId.toString()
      );
      expect(response.status).to.equal(200);
    });
  });
  it("Delete the Menu", function () {
    var config = {
      method: "delete",
      url: "http://" + listen_address + "/menu/" + menuId,
    };
    return axios(config).then(function (response) {
      expect(response.status).to.equal(200);
    });
  });
  it("Check that menu is deleted", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/menu/" + menuId,
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
