import routes from "../src/routes";
import axios from "axios";
import { expect } from "chai";
import "mocha";

describe("Test Deliverer routes", () => {
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
  it("Register a deliverer", () => {
    var config = {
      method: "put",
      url: "http://" + listen_address + "/",
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
  it("Get the deliverer", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/" + userId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Edit the deliverer", () => {
    user.email = "mocha2@test.fr";
    var config = {
      method: "post",
      url: "http://" + listen_address + "/" + userId,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(user),
    };

    return axios(config).then(function (response) {
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Get the edited deliverer", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/" + userId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Delete the registered deliverer", () => {
    var config = {
      method: "delete",
      url: "http://" + listen_address + "/" + userId,
      headers: {},
    };

    return axios(config).then(function (response) {
      expect(response.data._id).to.equal(userId);
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Check that deliverer is deleted", () => {
    var config = {
      method: "get",
      url: "http://" + listen_address + "/" + userId,
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
