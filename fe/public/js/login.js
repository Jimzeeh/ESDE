let $loginFormContainer = $('#loginFormContainer');
if ($loginFormContainer.length != 0) {
    console.log('Login form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = "https://54.144.197.122:5000";
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let webFormData = new FormData();
        webFormData.append('email', email);
        webFormData.append('password', password);
        
	var FormDataToJSON = {};
	webFormData.forEach(function(value, key){
   		FormDataToJSON[key] = value;
	});
	var json = JSON.stringify(FormDataToJSON);

	axios({
                method: 'post',
                url: baseUrl + '/api/user/login',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                //Inspect the object structure of the response object.
                //console.log('Inspecting the respsone object returned from the login web api');
                //console.dir(response);
                userData = response.data;
                if (userData.role_name == 'user') {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('user/manage_submission.html');
                    return;
                }
                if (response.data.role_name == 'admin') {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('admin/manage_users.html');
                    return;
                }
            })
            .catch(function(response) {
                
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '6000',
                    text: 'Unable to login. Check your email and password',
                }).show();

            });
	
        axios({
                method: 'post',
                url: "https://fzrqq68164.execute-api.us-east-1.amazonaws.com/test_login",
                //data: webFormData,
		data: json,
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function(response) {
                //Inspect the object structure of the response object.
                //console.log('Inspecting the respsone object returned from the login web api');
                console.dir(response.data.filedata.role_id);
		console.dir(response.data.filedata);
                //userData = response.data;
		userData = response.data.filedata;
                if (userData.role_name == 'user' || userData.role_id == 2/* modified code */) {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('user/manage_submission.html');
                    return;
                }
                if (response.data.role_name == 'admin' || response.data.role_id == 1 /* modified code */) {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('admin/manage_users.html');
                    return;
                }
            })
            .catch(function(response) {
                
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '6000',
                    text: 'Unable to login. Check your email and password',
                }).show();

            });

	
    });

} //End of checking for $loginFormContainer jQuery object


