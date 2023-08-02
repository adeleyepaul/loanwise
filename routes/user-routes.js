const express = require('express');

const { borrowers_details, saveEmploymentData } = require("../controllers/borrower-controller")
const { signup, login, verifyToken, getUser, refreshToken, forgetPassword, resetPassword, verifySignup, recoveryAccount, securityQuestions, professionalRole } = require("../controllers/user-controller");
const { getNotification, updateNotification } = require("../controllers/notification-controller");
const { getLoanTable, loanTable, addLoanData } = require('../controllers/loan-controllers');
const { testAPI } = require('../controllers/testapi-controller');
const { resetPasswordAndSecurityQuestion } = require('../controllers/securityPrivacy-controller');

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-signup", verifySignup)
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.get('/refresh', refreshToken, verifyToken, getUser);
router.post("/forget-password", forgetPassword);
router.post("/recovery-account", recoveryAccount)
router.post("/reset-password", resetPassword)
router.post("/borrow", borrowers_details)
router.put("/:userId/security-question", securityQuestions)
router.put("/professional-role/:userId", professionalRole);

router.post("/reset-password", resetPassword);
router.post("/borrowers-analysis", borrowers_details)
router.get("/settings/notification/:id", getNotification);
router.put("/settings/notification/:id", updateNotification);

// module.exports = router
// const { loanTable } = require("../controllers/loan-controllers")

// const router = express.Router();

// router.get("/loan-performance-table", loanTable);
// const { loanTable } = require("../controllers/loan-controllers")

// router.get("/loan-performance-table", loanTable);
router.get("/loan-table", getLoanTable)
router.post("/create-loan", loanTable)
// router.post("/add-loan", addLoanData)

//router portfolio analysis
router.post("/borrowers-details", borrowers_details)
router.post("/employment-details", saveEmploymentData)

//router test data science API
router.post("/testapi", testAPI)
router.post("/settings/security-privacy/:id", resetPasswordAndSecurityQuestion);

// module.exports = router
// const { loanTable } = require("../controllers/loan-controllers")

// const router = express.Router();

router.get("/loan-performance-table", loanTable);

module.exports = router
