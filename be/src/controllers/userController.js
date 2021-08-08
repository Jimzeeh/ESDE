const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');

/*

exports.processDesignSubmission = (req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.body.userId;
    let file = req.body.file;
    fileDataManager.uploadFile(file, async function(error, result) {
        console.log('check result variable in fileDataManager.upload code block\n', result);
        console.log('check error variable in fileDataManager.upload code block\n', error);
        let uploadResult = result;
        if (error) {
            let message = 'Unable to complete file submission.';
            res.status(500).json({ message: message });
            res.end();
        } else {
            //Update the file table inside the MySQL when the file image
            //has been saved at the cloud storage (Cloudinary)
            let imageURL = uploadResult.imageURL;
            let publicId = uploadResult.publicId;
            console.log('check uploadResult before calling createFileData in try block', uploadResult);
            try {
                let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
                console.log('Inspert result variable inside fileDataManager.uploadFile code');
                console.log(result);
                if (result) {
                    let message = 'File submission completed.';
                    res.status(200).json({ message: message, imageURL: imageURL });
                }
            } catch (error) {
                let message = 'File submission failed.';
                res.status(500).json({
                    message: message
                });
            }
        }
    })
}; //End of processDesignSubmission

*/

exports.processDesignSubmission = async(req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.body.userId;
    let file = req.body.file;
    try{
        let results = await fileDataManager.uploadFile(file)
        let uploadResult = results;
        //Update the file table inside the MySQL when the file image
        //has been saved at the cloud storage (Cloudinary)
        let imageURL = uploadResult.imageURL;
        let publicId = uploadResult.publicId;
        console.log('check uploadResult before calling createFileData in try block', uploadResult);
        try {
            let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
            console.log('Inspert result variable inside fileDataManager.uploadFile code');
            console.log(result);
            if (result) {
                let message = 'File submission completed.';
                res.status(200).json({ message: message, imageURL: imageURL });
            }
        } catch (error) {
            let message = 'File submission failed.';
            res.status(500).json({
                message: message
            });
        }
    } catch(error){
        let message = 'Unable to complete file submission.';
        res.status(500).json({ message: message });
        res.end();
    }
    
    
}; //End of processDesignSubmission

exports.processGetSubmissionData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;
    try {
        let results = await fileDataManager.getFileData(userId, pageNumber, search);
        console.log('Inspect result variable inside processGetSubmissionData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        console.log(error);
        //return res.status(500).json({
        //    message: error
        //});
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetSubmissionData

exports.processGetSubmissionsbyEmail = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;
    try {
        //Need to search and get the id information from the database
        //first. The getOneuserData method accepts the userId to do the search.
        let userData = await userManager.getOneUserDataByEmail(search);
        console.log('Results in userData after calling getOneUserDataByEmail');
        console.log(userData);
        if (userData){       
        let results = await fileDataManager.getFileDataByUserId(userData[0].user_id, pageNumber);
        console.log('Inspect result variable inside processGetSubmissionsbyEmail code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }//Check if there is any submission record found inside the file table
    }//Check if there is any matching user record after searching by email
    } catch (error) {
        let message = 'Server is unable to process your request.';
        //return res.status(500).json({
        //    message: error
        //});
        console.log(error);
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetSubmissionsbyEmail

exports.processGetUserData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;

    try {
        let results = await userManager.getUserData(pageNumber, search);
        console.log('Inspect result variable inside processGetUserData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'userdata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        //return res.status(500).json({
        //    message: error
        //});
        console.log(error);
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetUserData

exports.processGetOneUserData = async(req, res, next) => {
    let recordId = req.params.recordId;

    try {
        let results = await userManager.getOneUserData(recordId);
        console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {
            var jsonResult = {
                'userdata': results[0],
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        //return res.status(500).json({
        //    message: error
        //});
        console.log(error);
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetOneUserData


exports.processUpdateOneUser = async(req, res, next) => {
    console.log('processUpdateOneUser running');
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;
    try {
        results = await userManager.updateUser(recordId, newRoleId);
        console.log(results);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }


}; //End of processUpdateOneUser

exports.processGetOneDesignData = async(req, res, next) => {
    let recordId = req.params.fileId;

    try {
        let results = await userManager.getOneDesignData(recordId);
        console.log('Inspect result variable inside processGetOneFileData code\n', results);
        if (results) {
            var jsonResult = {
                'filedata': results[0],
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process the request.';
        //return res.status(500).json({
        //    message: error
        //});
        console.log(error);
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetOneDesignData

exports.processSendInvitation = async(req, res, next) => {
    
    let userId = req.body.userId;
    let recipientEmail = req.body.recipientEmail;
    let recipientName = req.body.recipientName;
    console.log('userController processSendInvitation method\'s received values');
    console.log(userId);
    console.log(recipientEmail);
    console.log(recipientName);

    try {
        //Need to search and get the user's email information from the database
        //first. The getOneuserData method accepts the userId to do the search.
        let userData = await userManager.getOneUserData(userId);
        console.log(userData);
        let results = await userManager.createOneEmailInvitation(userData[0],recipientName, recipientEmail);
        if (results) {
            var jsonResult = {
                result: 'Email invitation has been sent to ' + recipientEmail + ' ',
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        console.log(error);
        let message = 'Server is unable to process the request.';
        //return res.status(500).json({
        //    message: message,
        //    error:error
        //});
        return res.status(500).json({
            message: message,
            error: message
        });
    }

}; //End of processSendInvitation



exports.processUpdateOneDesign = async(req, res, next) => {
    console.log('processUpdateOneFile running');
    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    try {
        results = await userManager.updateDesign(fileId, designTitle, designDescription);
        console.log(results);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }


}; //End of processUpdateOneDesign


// added code
exports.processRetrieveAdminId = async(req, res, next) => {
    console.log('processRetrieveAdminId');
    let message = 'Server is unable to process the request.';
    //let userId = req.headers['user'];
    let userId = req.body.userId;

    console.log(userId);
    try {
        results = await userManager.GetAdminIds(userId);
        console.log(results);
        if (results.length == 0){
            return res.status(500).json({
                message: message
            });
        } else {
            console.log("Valid Admin");
            next();
        }
        
    } catch (error) {
        return res.status(500).json({
            message: message
        });
    }

} //End of processRetrieveAdminId

exports.processRetrieveAdminId_2 = async(req, res, next) => {
    console.log('processRetrieveAdminId');
    let message = 'Server is unable to process the request.';
    //let userId = req.headers['user'];
    let userId = req.body.userId;
    console.log(userId);
    try {
        results = await userManager.GetAdminIds(userId);
        console.log(results);
        if (results.length == 0){
            return res.status(500).json({
                message: message
            });
        } else {
            console.log("Valid Admin");
            return res.status(200).json({ message: 'Completed' });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: message
        });
    }

} //End of processRetrieveAdminId_2

exports.ValidateOwner = async(req, res, next) => {
    console.log('ValidateOwner');
    let message = 'Server is unable to process the request.';
    //let userId = req.headers['user'];
    let userId = req.body.userId;
    let fileId = req.body.fileId;
    console.log(userId);
    console.log(fileId)
    try {
        results = await userManager.MatchFileIdUserId(fileId,userId);
        console.log(results);
        if (results.length == 0 || results == undefined){
            return res.status(500).json({
                message: message
            });
        } else {
            console.log("Correct owner");
            next();
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: message
        });
    }

} //End of ValidateOwner

exports.ValidateOwner_2 = async(req, res, next) => {
    console.log('ValidateOwner');
    let message = 'Server is unable to process the request.';
    //let userId = req.headers['user'];
    let userId = req.body.userId;
    let fileId = req.body.fileId;
    console.log(userId);
    console.log(fileId)
    try {
        results = await userManager.MatchFileIdUserId(fileId,userId);
        console.log(results);
        if (results.length == 0 || results == undefined){
            return res.status(500).json({
                message: message
            });
        } else {
            console.log("Correct owner");
            res.status(200);
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: message
        });
    }

} //End of ValidateOwner
