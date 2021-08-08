fileId = localStorage.getItem('fileId');
userId = localStorage.getItem('user_id');
token = localStorage.getItem('token');
let webFormData2 = new FormData();
webFormData2.append('fileId', fileId);


axios({
    method: 'post',
    url: 'https://54.144.197.122:5000/api/user/design/Owner',
    data: webFormData2,
    headers: { 'Content-Type': 'multipart/form-data', 'user': userId, 
    'authorization': "Bearer " + token // added code
} 
})
.then(function(response) {
    new Noty({
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        timeout: '5000',
        text: 'Updated design information.',
    }).show();
})
.catch(function(response) {
    //Handle error
    window.location.replace('../home.html')

});

let $updateDesignFormContainer = $('#updateDesignFormContainer');
if ($updateDesignFormContainer.length != 0) {
    console.log('Update Design form is detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit design details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        //const baseUrl = 'http://localhost:5000';
	const baseUrl = "https://54.144.197.122:5000";

        //Collect fileId value from the input element, fileIdInput (hidden input element)
        let fileId = $('#fileIdInput').val();
        //Obtain user id from local storage
        let userId = localStorage.getItem('user_id');
        //Collect design title and description input
        let designTitle = $('#designTitleInput').val();
        let designDescription = $('#designDescriptionInput').val();
        //Create a FormData object to build key-value pairs of information before
        //making a PUT HTTP request.
        let webFormData = new FormData();
        webFormData.append('designTitle', designTitle);
        webFormData.append('designDescription', designDescription);
        webFormData.append('fileId', fileId);
        let token = localStorage.getItem('token'); // added code
        axios({
                method: 'put',
                url: baseUrl + '/api/user/design/',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data', 'user': userId, 
                'authorization': "Bearer " + token // added code
            } 
            })
            .then(function(response) {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '5000',
                    text: 'Updated design information.',
                }).show();
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '6000',
                    text: 'Unable to update.',
                }).show();

            });
    });
    $('#backButton').on("click", function(e) {
        e.preventDefault();
        window.history.back();
    });

    function getOneData() {
        //const baseUrl = 'http://localhost:5000';
	const baseUrl = "https://54.144.197.122:5000";

        //Get the fileId information from the web browser URL textbox
        let query = window.location.search.substring(1);
        let arrayData = query.split("=");
        //let fileId = arrayData[1];
        let fileId = localStorage.getItem('fileId')
        console.dir('Obtained file id from URL : ', fileId);
        let userId = localStorage.getItem('user_id');
        let token = localStorage.getItem('token'); //added code
        axios({
                headers: {
                    'user': userId,
                    'authorization': 'Bearer ' + token, // added code
                },
                method: 'get',
                //url: baseUrl + '/api/user/design/' + fileId,
		url: "https://fzrqq68164.execute-api.us-east-1.amazonaws.com/test?fid=" + fileId,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically populate the elements with data.
                console.dir(response.data);
                const record = response.data.filedata;
                $('#designTitleInput').val(record.design_title).focus();

                $('#fileIdInput').val(record.file_id);
                $('#designDescriptionInput').val(record.design_description).focus();

                $('#designImage').attr('src', record.cloudinary_url).focus();
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable retrieve file data',
                }).show();
            });

    } //End of getOneData
    //Call getOneData function to do a GET HTTP request on an API to retrieve one user record
    getOneData(); //Call getOneData to begin populating the form input controls with the existing record information.
} //End of checking for $updateDesignFormContainer jQuery object