//token generation
const { v4: uuidv4 } = require('uuid');

function generateVerificationToken() {
  // Generate a version 4 (random) UUID
  return uuidv4();
}

module.exports = { generateVerificationToken };



  
  