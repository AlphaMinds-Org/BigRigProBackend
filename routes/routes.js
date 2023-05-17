const express = require("express");
const upload = require("../middlewares/uploadImage");
const uploadreview = require("../middlewares/reviewImage");

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
  downloadFile,
} = require("../controller/client.controller");

const {
  messageCreate,
  messageIndex,
} = require("../controller/message.controller");

const {
  reviewCreate,
  reviewIndex,
  reviewDelete,
} = require("../controller/review.controller");

const {
  bulkmailCreate,
} = require("../controller/bulkemail.controller");

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

//membership offer routes
// router.get("/api/v1/offers", offerIndex);
router.post('/api/v1/client/create',upload,clientCreate );
router.get('/api/v1/client',clientIndex );
router.post('/api/v1/client/delete',clientDelete );
router.get('/api/v1/client/:clientId/:filename', downloadFile);
// router.post("/api/v1/emailSubscribe", emailSubscribe);

router.post('/api/v1/review/create',uploadreview,reviewCreate );
router.get('/api/v1/review',reviewIndex );
router.post('/api/v1/review/delete',reviewDelete );
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

router.post("/api/v1/message/create", messageCreate);
router.get("/api/v1/message", messageIndex);
// router.get("/config", config);

router.post("/api/v1/bulkmail", bulkmailCreate);
// router.post("/image-upload", upload, uploadImage);

module.exports = {
  routes: router,
};
