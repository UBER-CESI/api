import routes from "../src/routes";
import axios from "axios";
import { expect } from "chai";
import "mocha";

describe("Test Restaurants routes", () => {
  var restaurantId: number;
  var restaurant = {
    name: "mochaResto",
    address: "32 rue truc 33300 Bordeaux",
    phoneNumber: "0666666666",
    email: "mochaResto@restaurant.com",
  };
  it("Register a restaurant", () => {
    var config = {
      method: "put",
      url:
        "http://" +
        process.env.listen_address +
        ":" +
        process.env.listen_port +
        "/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(restaurant),
    };

    return axios(config).then(function (response) {
      expect(response.status).to.equal(201);
      restaurantId = response.data._id;
    });
  });
  it("Get the restaurant", () => {
    var config = {
      method: "get",
      url:
        "http://" +
        process.env.listen_address +
        ":" +
        process.env.listen_port +
        "/" +
        restaurantId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data.email).to.equal(restaurant.email);
      expect(response.data.name).to.equal(restaurant.name);
      expect(response.data.phoneNumber).to.equal(restaurant.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Edit the restaurant", () => {
    restaurant.email = "mocha2@test.fr";
    var config = {
      method: "post",
      url:
        "http://" +
        process.env.listen_address +
        ":" +
        process.env.listen_port +
        "/" +
        restaurantId,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(restaurant),
    };

    return axios(config).then(function (response) {
      expect(response.data.email).to.equal(restaurant.email);
      expect(response.data.name).to.equal(restaurant.name);
      expect(response.data.phoneNumber).to.equal(restaurant.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Get the edited restaurant", () => {
    var config = {
      method: "get",
      url:
        "http://" +
        process.env.listen_address +
        ":" +
        process.env.listen_port +
        "/" +
        restaurantId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data.email).to.equal(restaurant.email);
      expect(response.data.name).to.equal(restaurant.name);
      expect(response.data.phoneNumber).to.equal(restaurant.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Delete the registered restaurant", () => {
    var config = {
      method: "delete",
      url:
        "http://" +
        process.env.listen_address +
        ":" +
        process.env.listen_port +
        "/" +
        restaurantId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data._id).to.equal(restaurantId);
      expect(response.data.email).to.equal(restaurant.email);
      expect(response.data.name).to.equal(restaurant.name);
      expect(response.data.phoneNumber).to.equal(restaurant.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Check that restaurant is deleted", () => {
    var config = {
      method: "get",
      url:
        "http://" +
        process.env.listen_address +
        ":" +
        process.env.listen_port +
        "/" +
        restaurantId,
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
    routes.stop();
  });
});
