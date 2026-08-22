import cors from "cors";
import express from "express";

const clientOrigin =
  process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

export const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: clientOrigin,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
  });
});