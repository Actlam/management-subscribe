import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { subscriptionsRoute } from "./routes/subscriptions";
import { analyticsRoute } from "./routes/analytics";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:3000",
  })
);

app.route("/api/subscriptions", subscriptionsRoute);
app.route("/api/analytics", analyticsRoute);

app.get("/", (c) => c.json({ message: "Subscription Management API" }));

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`API サーバー起動: http://localhost:${info.port}`);
});

export default app;
