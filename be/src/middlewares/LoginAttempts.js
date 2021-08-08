const winston = require('winston');
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: './logs/logs.log' })
    ]
  });

var failedAttempts_Email = {};

const LoginAttempts = {
    
    Attempts:  function(req, res, next){
        let email = req.body.email;
        console.log("Email: " + email);
        if (!(email in failedAttempts_Email)){
            failedAttempts_Email[email] = {count: 0, nextTry: new Date()};
        }

        if(failedAttempts_Email[email].count >= 3){
             
            res.status(429);    
        } else {
            next();
        }
       
        console.log(failedAttempts_Email);
        
    },

    onLoginSuccess: function(email) { 
        delete failedAttempts_Email[email]; 
    },

    
    failedLogin: function(email) {
        var currentdate = new Date(); 
        var datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds(); //Time stamp
        ++failedAttempts_Email[email].count;
        failedAttempts_Email[email].nextTry.setTime(Date.now() + 2000 * failedAttempts_Email[email].count);
        logger.log({
            level: 'info',
            message: `[${datetime}]` + "Email: " + email + " " + "Attempted logins: " + failedAttempts_Email[email].count + ", Next Try: " + failedAttempts_Email[email].nextTry
          });
          
    },

    
    
}

// Clean up people that have given up
var MINS10 = 600000, MINS30 = 3 * MINS10;
setInterval(function() {
    for (var Names in failedAttempts_Email) {
        if (Date.now() - failedAttempts_Email[Names].nextTry > MINS10) {
            delete failedAttempts_Email[Names];
        }
    }
}, MINS30);

module.exports = LoginAttempts;