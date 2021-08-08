// Newly added file
const validator = require('validator');

const validationFn = {

    validateUpdateSubmission: function (req, res, next) {

        console.log("validateUpdateSubmission middleware called");
        const fileId = req.body.fileId;
        const designTitleInput = req.body.designTitle;
        const designDescriptionInput = req.body.designDescription;

        reDesignTitleInput = new RegExp(`^[\\w\\s]+$`);
        reDesignDescriptionInput = new RegExp(`^[\\w\\s\\.]+$`);
        reFileId = new RegExp(`^\\d+$`);

        if (reDesignTitleInput.test(designTitleInput) && reDesignDescriptionInput.test(designDescriptionInput) && reFileId.test(fileId)) {
            next();
        } else {
            console.log("Error while submitting, most likely validation error");
            res.status(500);
            res.send(`{"message":"Error!!"}`);
        }
    },

    validateUserSearch: function (req, res, next) {

        console.log("validateUserSearch middleware called");
        let search = req.params.search

        reSearchInput = new RegExp(`^[\\w\\s]+$`);

        if (reSearchInput.test(search)) {
            next();
        } else {
            console.log("Error, most likely validation error");
            res.status(500);
            res.send(`{"message":"Error!!"}`);
        }
    },

    MustContain: function (req, res, next){ // added code
        console.log("MustContain middleware called");
        var password = req.body.password;
        console.log(password)
        rePasswordInput = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$`);

        if (rePasswordInput.test(password)){
            next();
        } else {
            console.log("Password must be 8 characters long, contain special characters, at least 1 number, 1 digit, 1 uppercase and lowercase letter.");
            res.status(500);
            res.send(`{"message":"Error!!"}`);
        }
    },

    


} //end validationFn


module.exports = validationFn;

