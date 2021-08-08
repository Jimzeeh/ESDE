// added code
userId = localStorage.getItem('user_id');
token = localStorage.getItem('token');
//baseUrl = 'http://localhost:5000';
const baseUrl = "https://54.144.197.122:5000";


axios({
    headers: {
        //Modify this will affect the checkUserFn.js middleware file at the backend.
        'user': userId,
        'authorization': 'Bearer ' + token,
    },
    method: 'post',
    url: baseUrl + '/api/user/Admin',
}).then(function(response){
    console.log(response);
}).catch(function(response){
    window.location.replace('../home.html');
})
//

let $updateUserFormContainer = $('#updateUserFormContainer');
if ($updateUserFormContainer.length != 0) {
    console.log('Update User form is detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit user role data
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = "https://54.144.197.122:5000";
        //Collect role id value from the input element, roleIdInput
        let roleId = $('#roleIdInput').val();
        //Obtain user id from local storage
        let userId = localStorage.getItem('user_id');
        //There is a hidden textbox input, userRecordIdInput
        let recordId = $('#userRecordIdInput').val();
        let webFormData = new FormData();
        webFormData.append('roleId', roleId);
        webFormData.append('recordId', recordId);
        let token = localStorage.getItem('token'); //added code
        axios({
                method: 'put',
                url: baseUrl + '/api/user/',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data', 'user': userId , 
                'authorization': 'Bearer ' + token, //added code
                }
            })
            .then(function(response) {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '5000',
                    text: 'User role has changed.',
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

    function getOneUser() {

        const baseUrl = "https://54.144.197.122:5000";
        var query = window.location.search.substring(1);
        let arrayData = query.split("=");
        let recordIdToSearchUserRecord = arrayData[1];
        let userId = localStorage.getItem('user_id');
        let token = localStorage.getItem('token'); //added code
        axios({
                headers: {
                    'user': userId
                },
                method: 'get',
                url: baseUrl + '/api/user/' + recordIdToSearchUserRecord,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically populate the elements with data.
                console.dir(response.data);
                const record = response.data.userdata;
                $('#fullNameOutput').text(record.fullname);
                $('#emailOutput').text(record.email);
                $('#userRecordIdInput').val(record.user_id);
                $('#roleIdInput').val(record.role_id);

            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable retrieve user data',
                }).show();
            });

    } //End of getOneUser
    //Call getOneUser function to do a GET HTTP request on an API to retrieve one user record
    getOneUser();
} //End of checking for $updateUserFormContainer jQuery object