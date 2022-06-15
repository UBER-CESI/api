import routes from "../src/routes";
import axios from "axios";
import { expect, should } from "chai";
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
  it("Register a customer", () => {
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
  it("Get the customer", () => {
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
  it("Edit the customer", () => {
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
  it("Get the edited customer", () => {
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
  it("Suspend the customer", () => {
    user.email = "mocha2@test.fr";
    var config = {
      method: "post",
      url: "http://" + listen_address + "/" + userId + "/suspend",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ suspend: true }),
    };

    return axios(config).then(function (response) {
      should().exist(response.data.suspendedAt);
      expect(response.status).to.equal(200);
    });
  });
  it("Unsuspend the customer", () => {
    user.email = "mocha2@test.fr";
    var config = {
      method: "post",
      url: "http://" + listen_address + "/" + userId + "/suspend",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ suspend: false }),
    };

    return axios(config).then(function (response) {
      should().not.exist(response.data.suspendedAt);
      expect(response.status).to.equal(200);
    });
  });
  it("Get the edited customer", () => {
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
  it("Delete the registered customer", () => {
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
  it("Check that customer is deleted", () => {
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
