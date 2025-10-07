const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { COOKIE_SIGN } = require('./config');
const { mongoDB } = require('./db');
const { serve } = require('inngest/express');
const { client, functions } = require('./inngest');
const authRoutes = require('./routes/auth');
const routes = require('./routes');

const startServer = async () => {
  await mongoDB();

  const app = express();

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use(cookieParser(COOKIE_SIGN));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/auth', authRoutes);
  app.use('/api', routes);

  app.use("/api/inngest",serve({ client, functions }));

  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};


startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
