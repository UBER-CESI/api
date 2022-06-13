import routes from "../src/routes";
import axios from "axios";
import { expect } from "chai";
import "mocha";

describe("Test Customer routes", () => {
  const listen_address =
    process.env.LISTEN_ADDRESS + ":" + process.env.LISTEN_PORT;
  var userId: Number;
  var user = {
    email: "mocha@test.fr",
    nickname: "mocha",
    firstname: "test",
    lastname: "yes",
    phoneNumber: "0666666666",
  };
  var restaurantId: Number;
  var restaurant = {
    name: "mochaResto",
    address: "32 rue truc 33300 Bordeaux",
    phoneNumber: "0666666666",
    email: "mochaResto@restaurant.com",
  };
  var orderId: Number;
  /*it("Create a Restaurant and a customer", () => {
    var config = {
      method: "put",
      url: "http://" + listen_address + "/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(user),
    };

    return axios(config).then(function (response) {
      expect(response.status).to.equal(201);
      userId = response.data._id;
    });
  });*/

  it("Create a Restaurant and a customer", () => {
    var config = {
      method: "put",
      url: "http://" + listen_address + "/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(user),
    };

    return axios(config).then(function (response) {
      expect(response.status).to.equal(201);
      userId = response.data._id;
    });
  });

  after(() => {
    routes.stop();
  });
});
