"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/user/userController");
const authorization_1 = require("../middleware/authorization");
const router = (0, express_1.Router)();
router.get("/users/:id", authorization_1.auth, userController_1.getUser);
exports.default = router;
