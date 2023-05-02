const express = require("express");
const upload = require("../middlewares/uploadImage");

const {
  signup,
  login,
  ResetPassword,
  ForgotPassword,
  TokenVerification,
  verifyEmail
} = require("../controller/user.controller");

const {
  clientCreate,
  clientIndex,
  clientDelete,
} = require("../controller/client.controller");

const router = express.Router();

//membership offer routes
// router.get("/api/v1/offers", offerIndex);
router.post('/api/v1/client/create',upload,clientCreate );
router.get('/api/v1/client',clientIndex );
router.delete('/api/v1/client/delete/:id',clientDelete );

// router.post("/api/v1/emailSubscribe", emailSubscribe);

// router.get("/api/v1/membershipPlan", membershipPlanIndex);
// router.get("/api/v1/testimonials", testimonialIndex);
// router.get("/api/v1/whyChooseUs",scuttlrIndex );
//auth routes
router.post("/api/v1/signup", signup);
router.post("/api/auth/login", login);
// router.post("/api/auth/forgetPassword", ForgotPassword);
// router.get("/api/auth/resetPassword/:id/:token", TokenVerification);
// router.post("/api/auth/resetPassword/:id/:token", ResetPassword);
// router.post("/api/auth/verifyEmail", verifyEmail);
//payment routes

// router.post("/create-payment-intent", CreatePaymentIntent);
// router.get("/config", config);

// router.post("/image-upload", upload, uploadImage);

module.exports = {
  routes: router,
};
