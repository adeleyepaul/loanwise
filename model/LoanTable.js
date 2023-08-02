const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    // required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    unique: true,
    // required: true,
  },
  phone_number: {
    type: Number,
    // required: true,
  },
  employment_status: {
    type: String,
  },
  employment_status_1: {
    type: String,
  },
  credit_score: {
    type: Number,
  },
  Disbursed: {
    type: Number,
  },
  loan_duration: {
    type: Number,
  },
  repayment_method: {
    type: String,
  },
  interest_rate: {
    type: Number,
  },
  due_date: {
    type: String,
  },
  loan_status: {
    type: String,
  },
  loan_status_2: {
    type: String,
  },
  late_fee: {
    type: String,
  },
  Refunded: {
    type: Number,
  },
  Default: {
    type: Number,
  },
  bvn: {
    type: String,
  },
  Category: {
    type: String,
  },
  first_repayment: {
    type: Number,
  },
  second_repayment: {
    type: Number,
  },
  loan_received: {
    type: String,
  },
  loan_reviewed: {
    type: String,
  },
  loan_disbursed: {
    type: String,
  },
  EmploymentData: {
    currentRole: {
      type: String,
      // required: true,
    },
    currentEmployer: {
      type: String,
      // required: true,
    },
    Loan_Term: {
      type: String,
      // required: true,
    },
    Verification_by_Loan_Company: {
      type: String,
      // required: true,
    },
    Loan_Purpose: {
      type: String,
      // required: true,
    },
    Application_Type: {
      type: String,
      // required: true,
    },
    Total_years_of_employment: {
      type: Number,
      // required: true,
    },
    Annual_Income: {
      type: Number,
      // required: true,
    },
    Income_Debt_Ratio: {
      type: Number,
      // required: true,
    },
    No_of_Mortgage_Account: {
      type: Number,
      // required: true,
    },
    Credit_Utilization_Rate: {
      type: Number,
      // required: true,
    },
    No_of_Open_Credit_Lines: {
      type: Number,
      // required: true,
    },
    requestedAmount: {
      type: Number,
      // required: true,
    },
  },
});

const Loan = mongoose.model('LoanTable', loanSchema);

module.exports = Loan;