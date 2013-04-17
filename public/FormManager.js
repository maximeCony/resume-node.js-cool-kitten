(function() {

    /*
    *   Basic form validation
    */
    FormManager = function() {

    	return {

    		init : function() {

    			$('#formButtonSendMessage').bind('click', $.proxy(this.validateForm, this));
    		},

            /*
            * Handle missing required input
            * @param inputName: String (required input)
            */
            formError : function(inputName) {

                //scroll to see the entire form
                window.location.hash = "#contactTitle";

                //set error style to input and label
                $(inputName).addClass("formError");

                //show required field message
                $('#formErrorMessage').show();
            },

            /*
            * Handle form validation
            */
            validateForm : function() {

                //prevent multiple submition
                $('#formButtonSendMessage').unbind('click');
                var formValid = true;

                //missing message field
                if($("#formTextArea").val().length == 0) {
                	formValid = false;
                	this.formError("#messageForm");
                } else {
                	$("#messageForm").removeClass("formError");
                }

                //missing name field
                if($("#inputName").val().length == 0) {
                	formValid = false;
                	this.formError("#nameForm");
                } else {
                	$("#nameForm").removeClass("formError");
                }

                //if the form is valid
                if(formValid) {
                	$('#formErrorMessage').hide();
                	$('#contactForm').submit();
                	$('#sendButtonContent').html('Sending...');
                } else {
                    //bind click event on submit button
                    $('#formButtonSendMessage').bind('click', $.proxy(this.validateForm, this));
                }
            }

            //end
        }
    };

}())