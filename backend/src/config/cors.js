import cors from "cors";

const corsOptions = {

  origin(origin, callback) {

    const cleanOrigin = origin ? origin.replace(/\/$/, "") : "";

    // Allow requests with no origin (like Postman or same-origin requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL
          .split(",")
          .map(o => o.trim().replace(/\/$/, ""))
      : [];

    // Allow localhost frontend only during development
    if (
      process.env.NODE_ENV === "development" &&
      (
        cleanOrigin === "http://localhost:5173" ||
        cleanOrigin === "http://127.0.0.1:5173"
      )
    ) {
      return callback(null, true);
    }

    // Allow configured frontend(s)
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);

  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]

};

export default cors(corsOptions);