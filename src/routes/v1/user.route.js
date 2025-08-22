
const {Router} = require('express');
const Controller = require('../../controllers');
const Middleware = require('../../middlewares');
const userRoutes = Router();

 userRoutes.post("/register",
                      Middleware.Auth.isUserAuthenticated,
                      Middleware.Auth.validateUserInput,
                      Controller.User.addUser
                    );
 userRoutes.get("/me",
                      Middleware.Auth.isUserAuthenticated,
                      Controller.User.currUser
                    );

userRoutes.get("/",Controller.User.getAllUsers)

userRoutes.get('/:id',Middleware.Auth.isUserAuthenticated,Controller.User.getUser)

userRoutes.patch('/:id',
    Middleware.Auth.isUserAuthenticated,
    Middleware.User.validateUpdateUserRequest,
    Controller.User.updateUser)

 userRoutes.delete('/:id',Middleware.Auth.isUserAuthenticated,Controller.User.deleteUser)

 module.exports = userRoutes