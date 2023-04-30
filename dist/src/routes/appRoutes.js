"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const appController_1 = require("./../controller/appController");
const appRouter = express_1.default.Router();
appRouter.get('/', appController_1.home);
appRouter.post('/copy-dir', appController_1.copyData);
module.exports = appRouter;
//# sourceMappingURL=appRoutes.js.map