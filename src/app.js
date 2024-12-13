const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./configs/database.config');
const config = require('./configs/config');
const loggingMiddleware = require('./middlewares/logging.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const BookController = require('./books/books.controller');
const AuthorController = require('./authors/authors.controller');
const MemberController = require('./members/members.controller');

dotenv.config();

const app = express();

const setupMiddleware = (app) => {
  app.use(loggingMiddleware);
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
};

const initializeControllers = async (controllers) => {
  for (const controller of controllers) {
    app.use(controller.router);
  }
};

const initializeApp = async () => {
  try {
    await connectDB();
    setupMiddleware(app);
    await initializeControllers([new BookController(), new AuthorController() , new MemberController()]);
    app.use(errorMiddleware);
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error during app initialization:', err.message);
    process.exit(1);
  }
};

initializeApp();
