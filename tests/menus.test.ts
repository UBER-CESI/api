import axios from "axios";
import { expect } from "chai";
import "mocha";

export default function suite() {
  const listen_address =
    process.env.LISTEN_ADDRESS + ":" + process.env.LISTEN_PORT;
  var restaurantId: number;
  var restaurant = {
    name: "mochaResto",
    address: "32 rue truc 33300 Bordeaux",
    phoneNumber: "0666666666",
    email: "mochaResto@restaurant.com",
  };
  var sampleMenuItem = {};
  before(() => {
    var config = {
      method: "put",
      url: "http://" + listen_address + "/register",
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
  it("Create an Item", function () {});
  after(() => {
    var config = {
      method: "delete",
      url: "http://" + listen_address + "/" + restaurantId,
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
}
