(function($) { $(function() {
	// Skip if not an a change view.
	if (!($("body").hasClass("change-form"))) return;
	
	// Set the flag "action_is_post" if the user leaves the page by submitting
	// the form.
	var action_is_post = false;
    $("form").submit(function () {
        action_is_post = true;
    });
	  
	// Wait until the form has the "csrfmiddlewaretoken" when trying to
	// serialize it and then store it to "original_form_state".
	var original_form_state = null;
	$(window).load(function() {
		function set_form_state() {
			tmp = $('form').serialize();
			if (tmp.indexOf('csrfmiddlewaretoken=') !== -1) {
				original_form_state = tmp;
			} else {
				setTimeout(set_form_state, 50);
			}	
		}
		set_form_state();
	});
	
	/**
	 * Binds the "beforeunload" event and warns the user if she has unsaved
	 * changes in the form when she tries to leave by other means than 
	 * submitting.
	 */
	$(window).bind('beforeunload', function() {
		var present_form_state = $('form').serialize();
		// If user is not submitting form.
		if (!action_is_post
			// If the original form state got time enough to be set.
			&& original_form_state !== null
			// If the current form state does not contains the original one. Not 
			// checking for an exact match will (maybe) make all kind of dynamic 
			// stuff not interfere and get less false positives.
			&& present_form_state.indexOf(original_form_state) === -1)
		{
			return 'Du har ugemte ændringer på denne side. Er du sikker på at '
			+ 'du vil navigere væk fra siden?';
		} else {
			return null;
		}
	});

})})(jQuery || django.jQuery)
