const fs = require('fs');
const Loan = require('../model/LoanTable');

const loanTable = async (req, res, next) => {
    try {
      // Read the JSON file
      const data = fs.readFileSync(__dirname + '/' + 'csvjson.json', 'utf8');
      const jsonData = JSON.parse(data);
  
      // Save each entry to the database
      for (const entry of jsonData) {
        const newData = new Loan(entry);
        await newData.save();
      }
  
      res.send('Data saved to the database.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};
  

const getLoanTable = (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from the request query parameters
  const limit = 5; // Number of records per page

  Loan.find({})
    .skip((page - 1) * limit) // Skip records based on the current page
    .limit(limit) // Limit the number of records per page
    .then((loans) => {
      res.json(loans);
    })
    .catch((error) => {
      console.error('Error retrieving loan data from the database:', error);
      return res.status(500).send('Internal Server Error');
    });
};


// const addLoanData = async(req, res, next) => {
//     try{
//         const loanData = req.body

//         // create a new instance of the model
//         const loan = new Loan(loanData)

//         await loan.save()

//         res.json(loan);
//     } catch (error) {
//         console.error('Error saving loan to the database:', error);
//         return res.status(500).send('Internal Server Error');
//     }
// }

module.exports = {
  loanTable,
  // addLoanData,
  getLoanTable
};
