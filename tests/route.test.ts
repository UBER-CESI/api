import routes from "../src/routes";
import axios from "axios";
import { expect } from "chai";
import "mocha";

describe("Test Order routes", () => {
  const listen_address =
    process.env.LISTEN_ADDRESS + ":" + process.env.LISTEN_PORT;
  var orderId: Number;
  var order = {
    restaurantId: "acab",
    orderId: "acab2",
    delivererId: "acab3",
    totalPrice: 25,
    items: [{ id: "acab5" }],
  };
  it("Create an order", () => {
    var config = {
      method: "put",
      url: "http://" + listen_address + "/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(order),
    };

    return axios(config).then(function (response) {
      expect(response.status).to.equal(201);
      orderId = response.data._id;
    });
  });
  it("Get the order", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/" + orderId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data.restaurantId).to.equal(order.restaurantId);
      expect(response.data.items).to.eql(order.items);
      expect(response.data.orderId).to.equal(order.orderId);
      expect(response.data.delivererId).to.equal(order.delivererId);
      expect(response.data.totalPrice).to.equal(order.totalPrice);
      expect(response.status).to.equal(200);
    });
  });
  it("Edit the order", () => {
    order.totalPrice = 12324;
    var config = {
      method: "post",
      url: "http://" + listen_address + "/" + orderId,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(order),
    };

    return axios(config).then(function (response) {
      expect(response.data.restaurantId).to.equal(order.restaurantId);
      expect(response.data.items).to.eql(order.items);
      expect(response.data.orderId).to.equal(order.orderId);
      expect(response.data.delivererId).to.equal(order.delivererId);
      expect(response.data.totalPrice).to.equal(order.totalPrice);
      expect(response.status).to.equal(200);
    });
  });
  it("Get the edited order", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/" + orderId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data.restaurantId).to.equal(order.restaurantId);
      expect(response.data.items).to.eql(order.items);
      expect(response.data.orderId).to.equal(order.orderId);
      expect(response.data.delivererId).to.equal(order.delivererId);
      expect(response.data.totalPrice).to.equal(order.totalPrice);
      expect(response.status).to.equal(200);
    });
  });
  it("Delete the registered order", () => {
    var config = {
      method: "delete",
      url: "http://" + listen_address + "/" + orderId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data.restaurantId).to.equal(order.restaurantId);
      expect(response.data.items).to.eql(order.items);
      expect(response.data.orderId).to.equal(order.orderId);
      expect(response.data.delivererId).to.equal(order.delivererId);
      expect(response.data.totalPrice).to.equal(order.totalPrice);
      expect(response.status).to.equal(200);
    });
  });
  it("Check that order is deleted", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/" + orderId,
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
