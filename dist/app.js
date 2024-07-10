"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const http_status_codes_1 = require("http-status-codes");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const organizationRoutes_1 = __importDefault(require("./routes/organizationRoutes"));
const app = (0, express_1.default)();
const port = config_1.ENV.PORT || 3000;
const allowedOrigins = [
    config_1.ENV.IS_PROD ? "" : `http://localhost:${port}`,
].filter(Boolean);
const corsOptions = {
    origin: (origin, callback) => {
        if ((typeof origin === "string" && allowedOrigins.includes(origin)) ||
            !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // this header is needed when using http and not https
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    next();
});
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", authRoutes_1.default);
app.use("/api", userRoutes_1.default);
app.use("/api", organizationRoutes_1.default);
config_1.db.sync({
// force: true,
})
    .then(() => {
    console.log("Database is connected");
})
    .catch((err) => {
    console.log(err);
});
app.use(function (_req, _res, next) {
    next((0, http_errors_1.default)(404));
});
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    // render the error page
    if (req.accepts("html")) {
        res.render("error", (renderErr) => {
            if (renderErr) {
                res.json({
                    message: err.message,
                    error: req.app.get("env") === "development" ? err : {},
                });
            }
        });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
