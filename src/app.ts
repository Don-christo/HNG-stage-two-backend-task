import express, { Request, Response, NextFunction } from "express";
import createError, { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import { db, ENV } from "./config";
import { StatusCodes } from "http-status-codes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import organizationRoutes from "./routes/organizationRoutes";

const app = express();
const port = ENV.PORT || 3000;

const allowedOrigins: Array<string> = [
  ENV.IS_PROD ? "" : `http://localhost:${port}`,
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      (typeof origin === "string" && allowedOrigins.includes(origin)) ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // this header is needed when using http and not https
  res.header("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", organizationRoutes);

db.sync({
  // force: true,
})
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err: HttpError) => {
    console.log(err);
  });

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

app.use(function (err: HttpError, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  // render the error page
  if (req.accepts("html")) {
    res.render("error", (renderErr: any) => {
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

export default app;
