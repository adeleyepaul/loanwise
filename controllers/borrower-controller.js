const axios = require('axios');
const Borrow = require('../model/LoanTable');

const getNextCustomerId = async () => {
  const existingIds = await Borrow.find().distinct('customer_id');
  let customerId = 1;
  while (existingIds.includes(`CST_${customerId}`)) {
    customerId++;
  }
  return `CST_${customerId}`;
};

const borrowers_details = async (req, res) => {
  const { fullName, address, email, alternativeEmail, phoneNumber, dateOfBirth, bvn } = req.body;

  try {
    // Check if the email already exists in the Borrow collection
    const existingEmail = await Borrow.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists', existingEmail });
    }

    const customerId = await getNextCustomerId();

    const existingBorrower = await Borrow.findOne({ customer_id: customerId });
    if (existingBorrower) {
      return res.status(400).json({ message: 'Borrower already exists', existingBorrower });
    }

    const borrower = new Borrow({
      customer_id: customerId,
      fullName,
      address,
      email,
      alternativeEmail,
      phoneNumber,
      dateOfBirth,
      bvn,
      employmentData: {},
    });

    await borrower.save();

    return res.status(201).json({ message: 'Borrower data saved successfully', borrower });
  } catch (error) {
    console.error('Error storing borrower details:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const saveEmploymentData = async (req, res) => {
  const {
    customer_id,
    currentEmployer,
    currentRole,
    Annual_Income,
    Total_Years_of_Employment,
    Income_Debt_Ratio,
    No_of_Open_Credit_Lines,
    Credit_Utilization_Rate,
    No_of_Mortgage_Account,
    Loan_Purpose,
    Loan_Term,
    requestedAmount,
    Verification_by_Loan_Company,
    Application_Type,
  } = req.body;

  try {
    const borrower = await Borrow.findOne({ customer_id });
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    borrower.employmentData = {
      currentEmployer,
      currentRole,
      Annual_Income,
      Total_Years_of_Employment,
      Income_Debt_Ratio,
      No_of_Open_Credit_Lines,
      Credit_Utilization_Rate,
      No_of_Mortgage_Account,
      Loan_Purpose,
      Loan_Term,
      requestedAmount,
      Verification_by_Loan_Company,
      Application_Type,
    };

    await borrower.save();

    try {
      const response = await axios.post('https://assorted-event-production.up.railway.app/request_body', borrower.employmentData);
      console.log('Employment data processed successfully');

      // Access and utilize the response data if needed
      const apiResponse = response.data;

      return res.status(200).json({ message: apiResponse });
    } catch (error) {
      console.error('Error processing employment data:', error.response.data);
      return res.status(422).json({ message: 'Unprocessable Entity', error: error.response.data });
    }
  } catch (error) {
    console.error('Error saving employment data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  borrowers_details,
  saveEmploymentData,
};
