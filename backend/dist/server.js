"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
mongoose_1.default
    .connect(validateEnv_1.default.MONGODB_URI, { dbName: 'note-app' })
    .then(() => {
    console.log('connect database successfully!');
    app_1.default.listen(validateEnv_1.default.PORT, () => {
        console.log(`Server run successfully at http://localhost:${validateEnv_1.default.PORT}`);
    });
})
    .catch((error) => {
    console.error('connect database failure with error:' + error);
});
