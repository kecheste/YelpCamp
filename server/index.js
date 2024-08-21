require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const AppError = require("./utils/AppError");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());

const frontUrl = process.env.FRONT_URL;

app.use(
  cors({
    credentials: true,
    origin: "https://yelp-camp-kohl.vercel.app",
    // origin: frontUrl,
  })
);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://yelp-camp-kohl.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS, PATCH, DELETE, POST, PUT"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Mongo connection established!!");
});

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dtnpzejau/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

const secret = process.env.SECRET;

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found!", 404));
});

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(status).json({ message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Serving on ${port}`);
});
