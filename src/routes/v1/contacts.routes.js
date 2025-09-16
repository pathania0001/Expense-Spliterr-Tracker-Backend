const express = require("express");
const Middleware = require("../../middlewares");
const Controller = require("../../controllers");
const contactRoutes = express.Router();

contactRoutes.route("/").get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Contact.getUserContactedWith
)

module.exports = contactRoutes;