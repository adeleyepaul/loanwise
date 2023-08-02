const axios = require("axios")

const testAPI = async (req, res) => {
    try {
      // Make a POST request to the API
      const response = await axios.post('https://assorted-event-production.up.railway.app/request_body', req.body);
  
      // Log the API response
      console.log('API response:', response.data);
  
      // Return the API response to the client
      return res.status(200).json(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error calling API:', error.response.data);
      } else {
        console.error('Error calling API:', error.message);
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  module.exports={
    testAPI,
  }
