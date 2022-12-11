/**************Cookies*******************/
function getCookie (name) {
	let value = '; ' + document.cookie; // prepend the delimiter ';' to guarantee a successful split
	let parts = value.split('; ' + name + '=');
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function trim(str, ch) {
    // Usage: trim('|hello|world|', '|'); // => 'hello|world'
    var start = 0, 
        end = str.length;

    while(start < end && str[start] === ch)
        ++start;

    while(end > start && str[end - 1] === ch)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function rtrim(str, ch) {
    // Usage: trim('|hello|world|', '|'); // => '|hello|world'
    var start = 0, 
        end = str.length;

    while(end > start && str[end - 1] === ch)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function ltrim(str, ch) {
    // Usage: trim('|hello|world|', '|'); // => 'hello|world|'
    var start = 0, 
        end = str.length;

    while(start < end && str[start] === ch)
        ++start;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

/* Extend jQuery with functions for PUT and DELETE requests. */

function _ajax_request(url, data, callback, type, method) {
    if ($.isFunction(data)) {
        callback = data;
        data = {};
    }
    return $.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        error: function(response){console.log('error status code:', response.status)},
        dataType: type
        });
}

$.extend({
    put: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    patch: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PATCH');
    },
    delete: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
    }
});

/*****Animated Treeview jQuery Extension***********************************************************************/
function enableTreeview() {
    /***forked from source: https://mdbootstrap.com/snippets/jquery/pjoter-2-0/766806, author: Piotr Obrebski****/
    $('.treeview-animated .nested').hide();//hide nested elements until used
    let $elements = $('.treeview-animated-element');
    $('.treeview-animated .closed').click(function () {
        $this = $(this);
        $target = $this.next();//should access the subsequent <ul>, to open it 
        $pointer = $this.find('.fa-angle-right');
        $this.toggleClass('open');
        $pointer.toggleClass('down');
        !$target.hasClass('active') ? $target.addClass('active').slideDown() :
            $target.removeClass('active').slideUp();
        return false;
    });
    $elements.click(function () {
        $this = $(this);
        $this.hasClass('opened') ? ($this.removeClass('opened')) : ($elements.removeClass('opened'), $this.addClass('opened'));
    })
    // console.log('tree view enabled');
};
/**********************************************************************Animated Treeview jQuery Extension******/

/*****DataTable tweaks********************************************************************************************/
function datatable_tweak(table_selector, tweak) {
// @table_selector (string): queryselector for the target table 
// @tweak (string): keyword for what we want to do to it
    var table = $(table_selector);
    // fail out if we couldn't find that table
    if (table.length < 1) return false;

    switch (tweak) {
        case 'full_width':
            // make the table fill 100% of container width, instead of just content min
            table.parents('.dataTables_wrapper').addClass('w-100');
            break;

        case 'wide_search_bar':
            table.parents('.dataTables_wrapper').find('.dataTables_filter').removeClass('dataTables_filter')// break the default styling of this class
                .addClass('row').parent().removeClass('col-md-6').addClass('col-12')// break the container to be full width
                .find('label').addClass('col-12');
            break;
    }


}
/********************************************************************************************DataTable tweaks*****/

/*****QSTRING: Factory Function**********************************************************************************/
function QSTRING() {
    window.onpopstate = function(){history.go()}; // autoload the history changes we will apply
    // // used to read and write browser location/history
    var q = {};

    // // properties:

    // stores the values read from a querystring
    q.values = {};

    // // methods:

    q.read = function () {
        const self = q;
        var querystring = window.location.search;
        if (querystring) self.values = self.getParamsAsObject(querystring);
        // console.log(self.values);
        return self; // for chaining
    }

    q.write = function (modHistory) {
        // @modHistory (bool): if true we will write this as a new browser history location -- enabling back to prior state(optional)
        const self = q;

        var nextState = self.values; // object that is the basis of the state (provides info about the state)
        var nextURL = '?' + $.param(self.values);// using for search params (relative to current location) // ex: '?foo=bar'
        var nextTitle = ''; // not in use
        

        if (modHistory) {
            // This will create a new entry in the browser's history, without reloading
            window.history.pushState(nextState, nextTitle, nextURL);
        } else {
            // This will replace the current entry in the browser's history, without reloading
            window.history.replaceState(nextState, nextTitle, nextURL);
        }

    }

    q.getParamsAsObject = function (query) {
        // source: https://stackoverflow.com/a/43513777
        query = query.substring(query.indexOf('?') + 1);

        var re = /([^&=]+)=?([^&]*)/g;
        var decodeRE = /\+/g;

        var decode = function (str) {
            return decodeURIComponent(str.replace(decodeRE, " "));
        };

        var params = {}, e;
        while (e = re.exec(query)) {
            var k = decode(e[1]), v = decode(e[2]);
            if (k.substring(k.length - 2) === '[]') {
                k = k.substring(0, k.length - 2);
                (params[k] || (params[k] = [])).push(v);
            }
            else params[k] = v;
        }

        var assign = function (obj, keyPath, value) {
            var lastKeyIndex = keyPath.length - 1;
            for (var i = 0; i < lastKeyIndex; ++i) {
                var key = keyPath[i];
                if (!(key in obj))
                    obj[key] = {}
                obj = obj[key];
            }
            obj[keyPath[lastKeyIndex]] = value;
        }

        for (var prop in params) {
            var structure = prop.split('[');
            if (structure.length > 1) {
                var levels = [];
                structure.forEach(function (item, i) {
                    var key = item.replace(/[?[\]\\ ]/g, '');
                    levels.push(key);
                });
                assign(params, levels, params[prop]);
                delete (params[prop]);
            }
        }
        return params;
    };

    return q; // return what we built
}
/**********************************************************************************QSTRING: Factory Function*****/

/*****NAVIGATION: Factory Function**********************************************************************************/
function NAVIGATION(landingZone) {
    var navigation = {};//we will return this object after constructing it
    //@landingZone: string | queryselector for the zone we want loaded content to land in
    navigation.landingZone = $(landingZone);//stores the jQuery object for where we want loaded content to go
    navigation.loadTimeout = 0;
    navigation.reinitializeThis = null;
    navigation.reinitializeOptions = null;

    navigation.initialize = function () {
    }//end initialize method

    navigation.load = function (url, options) {
        $('.tooltip').hide();//if there are any tooltips out there, hide 'em before we load (could get stuck out there if their element gets removed)
        /*@href: string | the url we want to load content from
         *@options: object (optional)
               @options.method: string(optional) | allows specification about 'get' vs. 'post' requests, will assume 'get' by default
               @options.loadTimeout: int | a millisecond timeout on the content loading (if we want to introduce a visual delay)
               @options.loadingColor: string | a class name that associated with css color attribute: like 'text-primary' or 'text-danger' in MDBootstrap
        ******
        * This method loads via ajax the content the navbar link is requesting to load; will deposit returned content into the landing zone.
        */
        //parse the options passed to load method:
        if (options && options.ajaxMethod) { var ajaxMethod = options.ajaxMethod; } else { var ajaxMethod = 'GET';/*default if not specified*/ }
        if (options && options.loadTimeout) { navigation.loadTimeout = options.loadTimeout; } else { navigation.loadTimeout = 0; /*default if not specified*/ }
        if (options && options.loadingColor) { var loadingColor = options.loadingColor; } else { var loadingColor = 'text-primary'; /*default if not specified*/ }
        if (options && options.reinitialize) { navigation.reinitializeThis = options.reinitialize; } else { navigation.reinitializeThis = null; /*default if not specified*/ }
        if (options && options.reinitializeOptions) { navigation.reinitializeOptions = options.reinitializeOptions; } else { navigation.reinitializeOptions = null; /*default if not specified*/ }
        //Note: we only want to use loadTimout if we intend on giving the user visual feedback that 'something is happening', since it forces in some UI latency

        this.landingZone.html(['<div class="col-12 row justify-content-center my-5">',
            '<div class= "spinner-border ' + loadingColor + ' " role = "status" >',
            '<span class="sr-only">Loading...</span>',
            '</div >',
            '</div >'].join(''));//using an array.join() for IE friendly, since IE can't interpret interpolated strings...
        $.ajax({
            method: ajaxMethod,
            url: url,
            async: true,
            success: function (serverRes) {
                //console.log('I am back!');
                //setTimeout(function () { WHERE IS IT GOING; WHAT TO TURN BACK ON ONLOAD}, HOW LONG TO MANUALLY WAIT BEFORE SHOWING RESULT);
                setTimeout(function () { navigation.landingZone.html(serverRes); navigation.reinitialize(navigation.reinitializeThis, navigation.reinitializeOptions); }, navigation.loadTimeout);
            }
        });
        //$.get(url, null, navigation.loadCallback);//url, data, callback
        return this;//for chaining
    }//end .load method

    navigation.loadCallback = function (serverRes) {
        //console.log('I am back!');
        setTimeout(function () { navigation.landingZone.html(serverRes); navigation.reinitialize(); }, navigation.loadTimeout);
    }

    navigation.setActive = function (pageTitle) {
        //@pageTitle: string | looks for the navbar link which matches this page title, to highlight as the active link.
        var navLink = $('.navbar li.nav-item[data-page=' + pageTitle + ']');
        if (!navLink.hasClass('active')) {
            //only swap out the active link if this wasn't already the active navbar link
            $('.navbar li.nav-item.active').toggleClass('active');
            navLink.addClass('active');
        }
        return this;//for chaining
    }//end .setActive method

    navigation.reinitialize = function (object, options) {
        //This reinitialize method in the NAVIGATION object calls the reinitialize method in the specified object (with options if included)
        //NOTE: same name different object methods!!
        //@object: the object we want to reinitialize
        //@options: any required options that need to be passed into the specified object's initialize method
        if (!object) object = navigation.reinitializeThis;
        if (!options) options = navigation.reinitializeOptions;
        if (object) {
            object.initialize(options);
        }
        return this; //for chaining
    }//reinitialize chaining function

    return navigation;//the object we constructed with this factory function
}
/**********************************************************************************NAVIGATION: Factory Function*****/

/*****NOTIFICATION: Factory Function**********************************************************************************/
function NOTIFICATION() {
    //used for toasts and stuff...
    var notification = {};//we will return this object after constructing it

    notification.initialize = function () {
    }//end initialize method


    notification.toastQ = [];//an array of toast that are in queue for display
    notification.toast = function (querystring, message, icon) {
        /***
        Toast is formatted like this:
            <div id="material-toast-bottom-right" class="toast bottom-right"><div class="icon"><i class="fas fa-bell fa-lg"></i></div><div class="desc">Here is your toast message</div></div> //Note: #identifier is an example of a unique querystring
            //We have a pre-built toast in the bottom right, which was defined in meta/inc/modals.php
            //Good practice would say only show toasts in one location on the screen at a time, but this allows us to define toast styling for things other than the bottom right corner...
         ***/
        //@querystring: string | unique identifying querystring to select the target toast, such as #material-toast-bottom-right
        //@message: string | the text we want to display as the toast message
        //@icon: html string (optional)| what icon do we want to show up for the notification (default is a bell, if we don't send this parameter)

        //The parameters querystring and message are required for new toasts, if they are not provided we will simply look to the toastQ (queue) since that indicates an automatic recall           

        if (querystring && message) {//not null, so this is a new toast
            if ($(querystring + '.show').length > 0) {//if the target toast element has the show class currently, then we need to put our toast in the queue: toastQ
                notification.toastQ.push({ querystring: querystring, message: message, icon: icon });//appends the provided input parameters to the toastQ array | Note: if icon was not provided, it will go in as undefined, that is okay
                // console.log(notification.toastQ);
                return;//not going any further with this execution, just wait for it to be recalled after the current toast hides itself
            }

        } else {//this is an automatic recall, and we need to pull the first element out from the toastQ
            var queuedToast = notification.toastQ.shift();//removes the first element from toastQ, and returns it as the queuedToast
            // console.log(queuedToast);
            var querystring = queuedToast.querystring;//use the stored querystring to target the toast element
            var message = queuedToast.message;//use the stored message for the toast .desc element
            var icon = queuedToast.icon//remember, this is optional, it will default to a bell icon if not defined
        }
        var t = $(querystring);//t: the toast element, selected either by the input parameter querystring OR a querystring that we pulled from the queue: toastQ
        t.find('.desc').html(message);//insert the message for display
        if (icon)//if the icon was defined, change it from the default bell:
            t.find('.icon').html(icon);
        void t[0].offsetWidth;//wacky vanilla js/css hack to get a css animation to restart... | Note: the zero index of the jquery object is the vanilla html element
        t.addClass('show');//trigger the toast to animate in
        setTimeout(function () {
            //dev only: console.log('toast reset');//the toast is ready to be called again after this executes...
            t.removeClass("show");
            //reset the toast child divs to their defaults
            t.find('.icon').html("<i class='far fa-bell fa-lg'></i>");//the default notification icon
            t.find('.desc').html("Default toast message");//a default placeholder
            if (notification.toastQ.length > 0)
                notification.toast();//calling the function without parameters makes us look to the queue: toastQ (but only do that if the toast queue is not empty)
        }, 5000);//the toast will animate in and out for 5 secs total, per hardcoded css animations in meta.css, then we mark it as ready to reset when the show class is removed

    }

    notification.helpTips = function (helpArray, helpTrigger) {
        //The goal of this method is to iterate through an array of helpful user tooltips, if they trigger the help tips.
        /*@helpArray = array of objects
            {querystring: querystring to target the element, 
             text: string to display,
             delay: time delay before, (optional) | default: 0
             duration: time to last, (optional) | default: 3000 (3 secs)
             placement: top, right, bottom, left (optional) | default: 'bottom'
            }*/
        //@helpTrigger: jQuery object | refers to the element that was clicked to trigger helptips
        //Note: we will default to jQueryObject.first() for every querystring used to target elements for a helptip, 
        // Thus it is OKAY if you don't have a specific unique element to target, we will only pop up a tooltip on the first occurence of a match for that querystring.

        //I do want this to automatically progress to the next helpTip if we are on a page that doesn't have the relevant element (so that one helpTips array for the whole single-page app will do, not a new set per page)

        var playbackTime = 0;//we will add up all the time it should take to play through the helpTips 
        var maxIndex = helpArray.length - 1;//the highest array index applicable, if we reach the maxIndex then there is not a next element in the array...
        var helpStart = false;//we haven't started the helpTips chain yet (toggle to true once we have)
        helpArray.forEach(function (helpTip, index) {//each element in the helpArray is an object
            if (!helpTip.placement) helpTip.placement = 'bottom';//assign a default value if it wasn't set
            if (!helpTip.delay) helpTip.delay = 0;//assign a default value if it wasn't set
            if (!helpTip.duration) helpTip.duration = 3000;//assign a default value if it wasn't set
            var targetElement = $(helpTip.querystring).first();//define what html element gets this tooltip (first occurence only if not unique)
            if (targetElement.length == 0) {
                return;// ! go to the next iteration in the for loop if the target Element doesn't exist ! 
            }

            playbackTime += helpTip.delay + helpTip.duration;//add to the total playback time (we won't reactivate the helpTips trigger button until this total time has past)
            //Initialize the tooltip that we want:
            targetElement.tooltip({
                placement: helpTip.placement,
                title: helpTip.text,
                trigger: 'manual',
                html: true//allow html inserts in text for the tooltip
            });
            targetElement.prop('title', targetElement.attr('data-original-title'));//swap out the default MDB tooltip re-titling scheme, we just want to keep the html title property!
            targetElement.attr('data-original-title', null);

            //Chain the helptip to trigger the next one:
            var nextTarget;
            var nextHelpTip;
            var next = 1;//will increment past the subsequent next element if the direct next one in helpTips array is not valid (doesn't exist on the page)

            while (!nextTarget && index + next <= maxIndex) {//while we don't have a nextTarget defined, and there still exist subsequent elements in the array to check
                nextHelpTip = helpArray[index + next];
                nextTarget = $(nextHelpTip.querystring).first();
                if (nextTarget.length == 0) {
                    nextTarget = null;//wipe it, suggesting the while loop to continue looking, if that isn't a valid element on the page
                    nextHelpTip = null;//the actual helpArray element, not the html element described by nextTarget
                    next++;//increment to try again
                }
            }

            if (!helpStart) {//if we haven't started the helpTips chain yet
                helpStart = true;
                //var tempTitle = targetElement.attr('data-original-title');//gets the original inline title, which was stored in this data-attribute "data-original-title" by MDB default when the tooltip was initialized (above)
                //targetElement.attr('data-original-title', null);//wipes the title show that MDB bootstrap will use the tooltip options.title instead of what was inline html
                setTimeout(function () {
                    targetElement.tooltip('show');
                }, helpTip.delay);//if we are on the very first helpTip, show it now
                setTimeout(function () {
                    targetElement.tooltip('hide');
                }, helpTip.delay + helpTip.duration);//we have to know when to hide it, when it was shown + how long it should be shown
            }
            if (nextTarget && nextHelpTip) {//nextTarget is the html element the next tooltip will attach to, nextHelpTip is the next usable element in the helpArray
                targetElement.on('hidden.bs.tooltip', function () {//triggers when the first one hides
                    setTimeout(function () {
                        nextTarget.tooltip('show');
                    }, nextHelpTip.delay);//if we are on the very first helpTip, show it now setTimeout(function () {
                    setTimeout(function () {
                        nextTarget.tooltip('hide');
                    }, nextHelpTip.delay + nextHelpTip.duration);//we have to know when to hide it, when it was shown + how long it should be shown
                });//triggers when the first one hides
            } else {
                setTimeout(function () {//reactivates the helpTips trigger button once the enter process has had time to play through
                    helpTrigger.attr('data-helpTipsActive', 'false');
                }, playbackTime);
            }

        });//end: for each element in the helpArray, initialize the tooltip (doesn't show it yet), and set up timeout based triggers for showing them in order

    }//end: helptips method

    notification.loginstatus = function (checkFor) {//checks for the login status of the user, and prompts them to log back in if their session expires
        //@checkFor: string | the AD group name / session key we want to check that the user possesses in their valid session
        //Note: if the checkFor value is blank (most often it will be), the /login/checkStatus.php page assumes you just want to check if they have 'loggedin' status.

        //Initializes the period check for the users login status
        setInterval(function () {
            $.get('/login/checkStatus.php', { checkFor: checkFor }, notification.confirmedStatus);//url, data, callback
        }, 3000);//runs every 3 seconds

    }//end: loginstatus method

    notification.confirmedStatus = function (observedStatus) {
        //@observedStatus: the current state of the user's login | true (logged in), false (not logged in)
        //Note: the #login-status-warning modal exists in /meta/inc/modals.php
        if (observedStatus) {
            //DEV//console.log('login still valid');
            $('#login-status-warning').modal('hide');//we automatically close this warning modal if their status checks out true
        } else {
            //DEV//console.log('login has expired!');
            $('#login-status-warning').modal('show');//we automatically open this warning modal if their status checks out false
        }
    }//end: confirmedStatus callback

    return notification;//the object we constructed with this factory function
}/**********************************************************************************NOTIFICATION: Factory Function*****/


/****PSEUDOFORM: Factory Function*********************************************************************************/
function PSEUDOFORM(form, actionPage, callback) {
    /*Used to gather data from inputs on a form and post their values to an actionPage, without reloading the current page.
     * @form: string | a queryselector for the form we are attaching this pseudoform object to 
     * @actionPage: string | url for where to send the data
     * @callback: function to pass our post data to
     */
    var pseudoform = {};//we will build this

    //Store these for reference later:
    pseudoform.form = form;
    pseudoform.actionPage = actionPage;
    pseudoform.callback = callback;

    pseudoform.submit = function (extraValues, api_method) {
        // @extraValues (object): allow extra values to be passed in key-value pairs, prepended to the submitted data (avoids having to use hidden inputs to submit hidden values)
        // @api_method (string):  GET/POST/PATCH/PUT/DELETE >> also tells the submitting method to JSON.stringify the data
        var self = this;//should reference the object itself
        var data = {};//will append key:value pairs to this based on the data in the form inputs/textareas
        //Prepend extraValues, if submitted, to the data which is to be submitted upon form validation:
        if (extraValues) {
            for (var key in extraValues) {
                data[key] = extraValues[key];//sets the object property
            }
        }
        var valid = true;//we will assume the form is valid, until proven otherwise...
        $(self.form + ' input, ' + self.form + ' select, ' + self.form + ' textarea').each(function () {
            var element = $(this);
            if (!$(this)[0].checkValidity()) {//uses the vanilla js checkValidity (which is why we strip out the raw html element from jQuery object)
                valid = false;//oops, something is wrong! (we aren't going to POST any data in this case)
                element.tooltip({ title: 'You need to correct this field before submitting', trigger: 'manual', placement: 'bottom' });//if it isn't valid, tell them!
                element.tooltip('show');
                (function () { setTimeout(function () { element.tooltip('hide'); }, 4000) })(element);//Immediately executable! (to hide the tooltip)
            }
            if ($(this).attr('name') && !((element.prop('type') == 'radio' || element.prop('type') == 'checkbox') && !element.prop('checked'))) {//the is named element AND is NOT an unchecked radio/checkbox (we don't want to report an unchecked value...)
                data[$(this).attr('name')] = $(this).val();//add key:value pair to the data we will submit
            }
        });//for each input, select, or textarea in the form
        if (valid) {
            if(!api_method){
                // standard post submission method
                $.post(self.actionPage, data, self.callback);
            }else{
                switch(api_method.toUpperCase()){
                    case 'POST':
                        $.post(self.actionPage, JSON.stringify(data), self.callback);
                        break;
                    case 'PUT':
                        $.put(self.actionPage, JSON.stringify(data), self.callback);
                        break;
                    case 'PATCH':
                        $.patch(self.actionPage, JSON.stringify(data), self.callback);
                        break;
                    case 'DELETE':
                        $.delete(self.actionPage, JSON.stringify(data), self.callback);
                        break;
                    case 'GET': 
                        $.get(self.actionPage, data, self.callback); // no JSON stringify for GET method, specifically. We want query params in this strange use case
                        break;
                }
            }

            
        }
        return valid;//boolean: indicates if the submission was processed or not
    }//end submit method

    pseudoform.checkValidity = function (provideFeedback){
        // alias for validity check
        return this.validityCheck(provideFeedback);
    }
    pseudoform.validityCheck = function (provideFeedback) {
        //@provideFeedback: bool default=true| do we want to show the user feedback about their form validity via tooltips?
        if (provideFeedback == null) {
            provideFeedback = true;//set the default, if not provided by function call 
        }
        var self = this;//should reference the object itself
        var valid = true;//default validity, unless we find a required field that is missing a value
        $(self.form + ' input, ' + self.form + ' select, ' + self.form + ' textarea').each(function () {
            if (!$(this)[0].checkValidity()) {//uses the vanilla js checkValidity (which is why we strip out the raw html element from jQuery object)
                valid = false;//oops, something is wrong! (we aren't going to POST any data in this case)
                if (provideFeedback) {//only show feedback via tooltips if defined as true (default is on, but api can turn it off by passing provideFeedback = false)
                    var element = $(this);
                    console.log('There is an issue with input:');
                    console.log(element[0]);
                    
                    element.tooltip({ title: 'You need to correct this field before submitting', trigger: 'manual', placement: 'bottom' });//if it isn't valid, tell them!
                    if (element.is(":visible")) {//only show the feedback tooltip if the input is visible to the user
                        element.tooltip('show');
                        (function () { setTimeout(function () { element.tooltip('hide'); }, 4000) })(element);//Immediately executable! (to hide the tooltip)
                    }
                }
            }
        });//for each input, select, or textarea in the form
        return valid;
    }//end: validity check method
    return pseudoform;
}
/********************************************************************************PSEUDOFORMS: Factory Function*****/

/*****BUILDINGMAINTENANCE: Factory Function****************************************************************************/
function BUILDINGMAINTENANCE() {
    var buildingmaintenance = {};//we will build this
    buildingmaintenance.initialize = function () {
        //For workorderDetail page:
        $('.workorder-info').click(function () {
            var loadUrl = '/buildingmaintenance/page/workorderDetail.php?orderID=' + $(this).attr('data-workorderID');//define querystring for GET request
            navigation.load(loadUrl, { loadTimeout: 400, reinitialize: buildingmaintenance });//using the navigation object to load details about specified work order
        });//click for workorder rows

        $('.progress-btn, .completion-btn').click(function () {//opens appropriate confirmation modal
            var orderID = $(this).attr('data-workorderID');//first grab the id stored in the button's data
            var modalID = $(this).attr('data-modalWindow');//will be "progress-updates" or "completion-confirm" correspondingly
            $('#progress-updates-modal .progress-comment').val('');//clear the value in the progress update modal regardless, to ensure we don't carry over comment from other workorders
            $('#' + modalID + '-modal .orderID').html(orderID);//then replace what we see in the progress updates modal dialog
            $('#' + modalID + '-modal').modal('show');//show the modal for interaction
        });//click for progress/completion buttons 

        $('.reopen-btn').click(function () {//no need to confirm, just reopen it (user can close again if they goof)
            var data = {
                reopen: true,//update action
                orderID: $(this).attr('data-workorderID')
            };
            $.post('/buildingmaintenance/act/updateProgress.php', data, buildingmaintenance.reopenCallback);//url, data, callback
        });
        //for closedOrders page:
        var today = new Date();//today
        todayyear = (today.getYear() + 1900);//we have to add to the year 1900
        todaymonth = (today.getMonth() + 1);//and a zero-indexed month to get this datestring as yyyy-mm-dd
        if (todaymonth.toString().length < 2) todaymonth = '0' + todaymonth;//prepend a zero to get 2 digits, if needed
        todayday = today.getDate();
        if (todayday.toString().length < 2) todayday = '0' + todayday;//prepend a zero to get 2 digits, if needed
        todaystring = todayyear + '-' + todaymonth + '-' + todayday//to get this datestring as yyyy-mm-dd 
        var past = new Date();//initialize at today as starting date
        past.setTime(past.getTime() - 30 * 24 * 60 * 60 * 1000);//sets the time 30 days ago (via miliseconds * minutes * hours * days)
        pastyear = (past.getYear() + 1900);//we have to add to the year 1900
        pastmonth = (past.getMonth() + 1);//and a zero-indexed month to get this datestring as yyyy-mm-dd
        if (pastmonth.toString().length < 2) pastmonth = '0' + pastmonth;//prepend a zero to get 2 digits, if needed
        pastday = past.getDate();
        if (pastday.toString().length < 2) pastday = '0' + pastday;//prepend a zero to get 2 digits, if needed
        past = pastyear + '-' + pastmonth + '-' + pastday//to get this datestring as yyyy-mm-dd

        $('#dateFromInput').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            maxDate: today,
            format: 'yyyy-mm-dd',
            value: past
        });
        $('#dateToInput').datepicker({
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            maxDate: today,
            format: 'yyyy-mm-dd',
            value: todaystring
        });//initialize datepicker plugin for these elements (GIJGO)

        $('.closedOrderSearch .submit-btn').click(function () {
            closedOrderSearch.submit();//check if it is complete and give feedback to user if it isn't (by default 'this is a required field!' messages), then POST without page reload...
        });//click for cancel button if on newOrder page
        $('.closedOrderSearch .search-text').on('keyup', function (event) {//simulate clicking submit if you click 'enter' while typing in the search text
            if (event.keyCode === 13) { event.preventDefault(); $('.closedOrderSearch .submit-btn').click(); }
        })
        //for newOrder page:
        $('.newOrderForm .submit-btn').click(function () {
            newOrderForm.submit();//check if it is complete and give feedback to user if it isn't (by default 'this is a required field!' messages), then POST without page reload...
        });//click for cancel button if on newOrder page

        $('.newOrderForm .cancel-btn').click(function () {//sends you back to openOrders page if you cancel
            navigation.load('/buildingmaintenance/page/openOrders.php', { loadTimeout: 400, reinitialize: buildingmaintenance });//using the navigation object to load details about specified work order
        });//click for cancel button if on newOrder page

        $('#emergency-switch').change(function () {
            if ($('input[name=emergency]').val() == '0') {//toggle the hidden input value that this toggle is tied to
                $('input[name=emergency]').val('1');
            } else {
                $('input[name=emergency]').val('0');
            }
            $('.emergencyTxt, .non-emergencyTxt').toggleClass('d-none');//should easily swap out the text we can see above the submit button.
            $('.newOrderForm .submit-btn').toggleClass('btn-primary btn-danger');//easily swap button color between blue and red
        });//change listener for emergency toggle switch

    }//end initialize method

    buildingmaintenance.completionCallback = function (serverRes) {//once the POST for "mark complete" action completes, the openOrders page will reload
        console.log(serverRes);
        $('#completion-confirm-modal').modal('hide');//closes the modal window this action started from
        navigation.load('/buildingmaintenance/page/openOrders.php', { loadTimeout: 500, reinitialize: buildingmaintenance });//using the navigation object to load the open orders, which should now not include this one that was marked complete
    }

    buildingmaintenance.progressCallback = function (serverRes) {//once the POST for "update progress" action completes, the workorderDetail will reload (with orderID parameter)
        console.log(serverRes);
        $('#progress-updates-modal').modal('hide');//closes the modal window this action started from
        var loadUrl = '/buildingmaintenance/page/workorderDetail.php?orderID=' + $('.progress-btn').attr('data-workorderID');//grabs the workorder id stored in the existing progress-btn, to reload the same workorderDetails we have active
        navigation.load(loadUrl, { loadTimeout: 500, reinitialize: buildingmaintenance });//using the navigation object to load the open orders, which should now not include this one that was marked complete
    }

    buildingmaintenance.reopenCallback = function (serverRes) {//once the POST for "update progress" action completes, the workorderDetail will reload (with orderID parameter)
        console.log(serverRes);
        var loadUrl = '/buildingmaintenance/page/workorderDetail.php?orderID=' + $('.reopen-btn').attr('data-workorderID');//grabs the workorder id stored in the existing progress-btn, to reload the same workorderDetails we have active
        navigation.load(loadUrl, { loadTimeout: 500, reinitialize: buildingmaintenance });//using the navigation object to load the open orders, which should now not include this one that was marked complete
    }

    buildingmaintenance.orderSearchCallback = function (serverRes) {//gets the content of the page, ready to load into .sub-content via navigation?
        navigation.landingZone.html(serverRes);//using the standard navigation object (loads instantly, no preloader)
        buildingmaintenance.initialize();//re-initialize the newly generated content
    }

    return buildingmaintenance;//return what we built
}
/****************************************************************************buildingmaintenance: Factory Function*****/

/*****Crown Pointe: Factory Function****************************************************************************/
function CROWNPOINTE() {
    var crownpointe = {};//initialize what we are going to build

    crownpointe.initialize = function () {
        var $self = this;
        $('.user-type-link').click(function () {
            var userType = $(this).attr('data-userType');
            var loadUrl = '/crownpointe/page/users.php?userType=' + userType;
            navigation.load(loadUrl, { loadTimeout: 500, reinitialize: crownpointe });
        });//event listener for user type links

        $('.user-docs-link').click(function () {
            var userType = $('table.userList').attr('data-userType');
            var trainID = $(this).attr('data-trainID');
            //console.log(userType + '  ' + trainID);
            var loadUrl = '/crownpointe/page/userDocuments.php?userType=' + userType + '&trainID=' + trainID;
            navigation.load(loadUrl, { loadTimeout: 500, reinitialize: crownpointe });
        });//event listener for user docs links


        $('table.userList').DataTable({
            //scrollX: '100%',//to accomodate really wide tables
            "paging": false, //disabled pagination
            order: [[1, "asc"]]//sort by name alphabetically
        });//initializes our userList results, if they were generated on this page

        $('table.userDocs').DataTable({
            //scrollX: '100%',//to accomodate really wide tables
            "paging": false, //disabled pagination
            order: [[0, "asc"], [1, "asc"]]//sort by doc title, then date
        });//initializes our userList results, if they were generated on this page

    }//end: initialize method


    return crownpointe;
}
/****************************************************************************Crown Pointe: Factory Function*****/

/*****DEV_MENU: Factory Function**********************************************************************************/
function DEV_MENU() {//For /dev/ folder only (planning gen 3 menu)
    var menu = {};//build this
    menu.initialize = function () {
        Waves.attach('.waves-light', ['waves-light']);
        Waves.attach('.waves-dark', ['waves-dark']);


        $('.tile').mouseup(function () {
            var url = $(this).find('.url-line').attr('data-url');
            if (url && url != '')//only do anything if the data-url was defined as something useful
                setTimeout(function () { window.open(url, '_blank') }, 400);/*give the animation time to play through before opening new window*/
        });


        $('.add-btn').click(function () {
            var tweedleDee = $('#duplicate-template').html();
            var tweedleDum = "<div class='card tile new-tile square dark waves-light'>" + tweedleDee + "</div>";//will remove new-tile class after attaching the waves effect
            $('.add-btn-spacer').before(tweedleDum);
            Waves.attach('.new-tile', ['waves-light']);
            $('.new-tile').removeClass('new-tile');
        });//event listener for add button

        menu.progressBar('apps');//exec helper function
        // not showing docs status any more ... // menu.progressBar('docs');//exec helper function
    }//end: initialize method

    menu.progressBar = function (type) {
        //@type: string ['apps':'gen3 app development progress', 'docs':'documentation progress']
        if (!type) type = 'apps';//default to show apps progress

        var allApps = $('.tile').length;
        var deprecatedApps = $('.tile.deprecated').length;
        var deprecatedPercent = Math.round(deprecatedApps / allApps * 100)

        switch (type){
            case 'apps':
                var inProgressClass = '.tile.in-progress';//indicates apps in progress
                var doneClass = '.tile.done';//indicates apps that are migrated to gen3
                var deprecatedBar = '.deprecated-apps';//class name for applicable progress bar 
                var notStartedBar = '.notStarted-apps';//class name for applicable progress bar 
                var inProgressBar = '.inProgress-apps';//class name for applicable progress bar 
                var doneBar = '.done-apps';//class name for applicable progress bar 
                break;
            case 'docs':
                var inProgressClass = '.tile.docs-basic';//indicates basic documenation complete
                var doneClass = '.tile.docs-complete';//indicates fully documented with complete flowchart
                var deprecatedBar = '.deprecated-docs';//class name for applicable progress bar 
                var notStartedBar = '.notStarted-docs';//class name for applicable progress bar 
                var inProgressBar = '.inProgress-docs';//class name for applicable progress bar 
                var doneBar = '.done-docs';//class name for applicable progress bar 
                break;
        }
        var inProgress = $(inProgressClass).length;
        var doneApps = $(doneClass).length;

        var donePercent = Math.floor(doneApps / allApps * 100);
        var notStarted = allApps - (deprecatedApps + doneApps + inProgress);
        var inProgressPercent = Math.round(inProgress / allApps * 100);
        var notStartedPercent = 98 - (deprecatedPercent + inProgressPercent + donePercent);//use remaining
        var appsWeCareAbout = doneApps + inProgress + notStarted;//ignores deprecated in visible % calcs

        // set min display width to 25%
        notStartedPercent = 0 < notStartedPercent && notStartedPercent < 25 ? 25 : notStartedPercent;

        if (notStartedPercent > 0) { $(notStartedBar).css({ width: notStartedPercent + '%' }); } else { $(notStartedBar).hide(); }
            $(notStartedBar).find('span').html('Not Started (' + Math.round(notStarted / appsWeCareAbout * 100) + '%)');
         
        // set min display width to 10%
        inProgressPercent = 0 < inProgressPercent && inProgressPercent < 10 ? 10 : inProgressPercent;

        if (inProgressPercent > 0) { $(inProgressBar).css({ width: inProgressPercent + '%' }); } else { $(inProgressBar).hide(); }
        $(inProgressBar).find('span').html('WIP (' + Math.round(inProgress / appsWeCareAbout * 100) + '%)');
        
        if (donePercent > 0) { $(doneBar).css({ width: donePercent + '%' }); } else { $(doneBar).hide(); }
            $(doneBar).find('span').html('Ready (' + Math.round(doneApps / appsWeCareAbout * 100) + '%)');
        
        // recalc deprecated percent, since we may have set some min-width on other bars 
        deprecatedPercent = 98 - notStartedPercent - inProgressPercent - donePercent;

        if (deprecatedPercent > 0) { $(deprecatedBar).css({ 'min-width': deprecatedPercent + '%' }); } else { $(deprecatedBar).hide(); }
        

    }//end: progress bar - helper function for initialization



    return menu;//return what we built
}
/**********************************************************************************DEV_MENU: Factory Function*****/

/*****EVFS: Factory Function**********************************************************************************/
function EVIDENCEFILESHARE(landingZone) {
    var fileshare = {}//build this (simplified the object name since EVIDENCEFILESHARE is long to type...)

    fileshare.notifications = 0;//a count, to increment for toasts
    fileshare.activeDeleteButton = null;//we will store the jQuery element of a clicked delete button
    fileshare.activeFileID = null;//stores the fileID for an action in progress, such as for setting/changing recipients

    fileshare.initialize = function () {
        //attach event listeners when we load page content
        $('.modal-history').click(function () {//we want to open a modal which fills with ajax requested data from showHist.php
            var historyID = $(this).attr('data-fileID');//stores the id of the file we want to request history on
            var queryString = 'id=' + historyID;
            $.ajax({
                url: '/EVFS/act/showHist.php',
                data: queryString,
                method: 'GET',
                success: fileshare.historyCallback,
            });
        });

        /*$('.add-recipient').click(function () {//combined with change-recipient 
            fileshare.activeFileID = $(this).attr('data-fileID');//stores the fileID stored in that element
            console.log('Active file ID is: ' + fileshare.activeFileID);
            $('#change-recipient-modal').modal('show');
        });*/

        $('.add-recipient, .change-recipient').click(function () {//applies to either add-recipient buttons or change-recipient, based on whether data-currentRecipient is defined
            fileshare.activeFileID = $(this).attr('data-fileID');//stores the fileID stored in that element
            console.log('Active file ID is: ' + fileshare.activeFileID);
            var currentRecipient = $(this).attr('data-currentRecipient');//will only be defined if we are changing the existing recipient
            if (currentRecipient) $('#change-recipient-modal .user-select').val(currentRecipient);
            $('#change-recipient-modal').modal('show');
        });


        $('.delete-btn').click(function () {
            fileshare.activeDeleteButton = $(this);//store jQuery element for use in the deleteFile method, if we get a confirmation to delete
            var fileName = $(this).attr('data-fileName');
            $('#EVFS-deletion-modal .filenameInsert').html(fileName);//swap out for the user to see
            $('#EVFS-deletion-modal').modal('show');
        });

        $('#EVFS-deletion-modal .delete-confirmation').click(function () {
            $('#EVFS-deletion-modal').modal('hide');//close the confirmation modal
            fileshare.deleteFile(fileshare.activeDeleteButton);//actually run the deleteFile method
        });//attach for the delete confirmation button to run .deleteFile method with stored activeDeleteButton
        $('.notification-btn').click(function () {
            //triggers an email to the selected view-by user, via admin.php
            var fileID = $(this).attr('data-fileID');//we need this to identify the relevant userID from select dropdown
            var userID = $('.change-recipient[data-fileID=' + fileID + ']').attr('data-currentRecipient');//gets the selected user's ID by watching 
            var displayname = $('.change-recipient[data-fileID=' + fileID + '] .recipient-displayname').text();//the user's display name is here
            if (userID) {
                var fileName = $(this).attr('data-fileName');
                var data = { method: 1, fID: fileID, uID: userID, fN: fileName };//preparing to make a POST to admin.php (method:1 notify user)
                $.ajax({
                    url: '/EVFS/act/admin.php',
                    data: data,
                    method: 'POST',
                });//make the data post to admin.php for notification
                
                //Successful toast to the user:
                notification.toast('#material-toast-bottom-right', 'Sending notification: ' + displayname, '<i class="fas fa-paper-plane fa-lg"></i>');//dependency on notification object methods (in meta.js)
            } else {
                //Display warning notification toast that they haven't selected a user as a recipient yet:
                notification.toast('#material-toast-bottom-right', 'Oops, you need to select a recipient...', '<i class="fas fa-laugh-wink fa-lg"></i>');//dependency on notification object methods (in meta.js)
            }
        });//end: notification button

        var activeFilesTable = $('.table.activeFiles').DataTable({
            columnDefs: [{ orderable: false, targets: [4, 5, 6] }],//array index of unsortable columns
            "pageLength": 25,//by default, show top 25         
            order: [[1, "desc"]]//indicates to sort by column 'Upload Date' (newest files at the top)

        });
        //activeFilesTable.search('Clelland').draw();//using DataTable methods, apply a search to the table programatically (search is the input text to filter by, draw method redraws the table)
        //technically, the table doesn't automatically apply a search from getting input value put into its search bar (as it needs a keyup to trigger the redraw)
        //$('.dataTables_wrapper input[type=search]').val('Clelland');//but we are inserting the filter text where the user can see it, implying that they can change what it and see that the table responds to their input


    }//end: initialize method

    fileshare.deleteFile = function (deleteBtn) {
        //@element: jQuery element of the button that we clicked (before passing through the delete confirmation)
        //A preloader to demonstrate that action is being taken (color matches the other rows in the table)
        var parentRow = deleteBtn.parents('tr');
        parentRow.html(['<td colspan="8" class="blue-grey lighten-5"><div class="d-flex justify-content-center text-center my-1">',
            '<div class= "spinner-grow text-danger " role = "status" >',
            '<span class="sr-only">Deleting</span>',
            '</div >',
            '</div ></td>'].join(''));//puts the preloader in place

        setTimeout(function () {//timer for preloader autohide (server responses are usually faster than 1 sec, but we want the user to see that delay, for feedback)
            parentRow.html('');//wipe the preloader 
            parentRow.hide();//and hide the row
        }, 1000);

        var data = { method: 3, fID: deleteBtn.attr('data-fileID'), fN: deleteBtn.attr('data-fileName') };//preparing to make a POST to admin.php (method:3 is deletion)
        $.ajax({
            url: '/EVFS/act/admin.php',
            data: data,
            method: 'POST',
            success: fileshare.deleteCallback,
        });//make the data post to admin.php for deletion
    }//end: deleteFile method

    fileshare.submitRecipientChange = function () {
        var fileID = fileshare.activeFileID;//we stored this when they clicked into add/change a file recipient
        var userID = $('#change-recipient-modal .user-select').val();//the value of the desired recipient's userID
        var data = { method: 0, fID: fileID, uID: userID };//preparing to make a POST to admin.php (method:0 is set file security)
        $.ajax({
            url: '/EVFS/act/admin.php',
            data: data,
            method: 'POST',
        });//make the data post to admin.php for recipient change (set file security)

        $('#change-recipient-modal').modal('hide');//close the modal used to perform this action
        $('#change-recipient-modal .user-select').val('');//reset the dropdown for the next execution
        fileshare.activeFileID = null;//reset stored file ID for the next execution
    }//end: submitRecipientChange

    fileshare.deleteCallback = function (serverRes) {
        console.log('file deletion completed');
    }

    fileshare.historyCallback = function (serverRes) {
        $('#EVFS-history-modal .modal-body').html(serverRes);
        $('#EVFS-history-modal').modal('show');
    }

    return fileshare;//return what we built
}
/**********************************************************************************EVFS: Factory Function*****/

/*****EXEMPTIONS: Factory Function**********************************************************************************/
function EXEMPTIONS() {
    /*Used for Inmate Exemptions page*/
    // let $self = this;//for reference within embedded functions
    var exemptions = {};//build this
    exemptions.activeDeleteButton = null;//will store a jQuery object during delete process
    exemptions.initialize = function () {
        var self = this;//should reference the exemptions object itself 
        //we will call this after the navigation.load function, to make sure to attach event listeners to newly created elements
        $('form button.pseudo-submit').click(function () { exemptions.pseudoSubmit($(this).parents('form'), '/exemptions/act/addExempt.php', 'addExemptCallback'); });
        $('form .pseudo-form-input').on('keydown', function (event) { if (event.keyCode === 13) { event.preventDefault(); $('form button.pseudo-submit').click(); } });//hijack the enter key from submitting the form, to 'clicking' our pseudo-submit button
        $('.delete-btn').click(function () {
            self.activeDeleteButton = $(this);//store jQuery element for use in the deleteFile method, if we get a confirmation to delete
            var inmateNum = $(this).attr('data-inmateNum');
            $('#exemption-deletion-modal .inmateNumInsert').html(inmateNum);//swap out for the user to see
            $('#exemption-deletion-modal').modal('show');
        });
        $('.exemption-tbl').DataTable({ "order": [[2, "desc"]], "columnDefs": [{ "orderable": false, "targets": 0 }, { "orderable": false, "targets": 4 }] });//turn on MDB datatable functionality for exempted inmates table
    }//end initialize method

    exemptions.pseudoSubmit = function (form, actionPage, callback) {
        /* @form: jQuery object 
         * @actionPage: string | where we are going to post this search data
         * @callback: function name | what do we want to run after the server response comes back
         */
        var data = {};//blank object for the POST content
        var inputs = form.find('.pseudo-form-input').each(//grab the inputs within this form that are labelled with pseudo-form-input
            function () {
                var key = $(this).attr('name');
                var value = $(this).val();
                data[key] = value;//stores this key-value pair into the data we will post with our search query, only if it is valid
            });
        $.post(actionPage, data, exemptions[callback]);//Note to $self (pun intended): this is calling an method in the $self object by the name provided in callback parameter
    }//end pseudoSubmit method

    exemptions.addExemptCallback = function (serverRes) {
        console.log(serverRes);
        serverRes = JSON.parse(serverRes);//we are returning a JSON object, needs to be parsed first!
        if (serverRes.error == true) {//a custom error object will come back if we ran into a problem
            $('.user-error-txt').html(serverRes.errorTxt);  //show error text
        } else {
            //turned off for production $('.user-error-txt').html(serverRes.feedbackTxt);  //show success text real quick
            window.location = '/exemptions';//redirect to home page
        }
    }//addExemptCallback

    /*DEPRECATED: 
     * exemptions.confirmDeletion = function (element) {
        //@element: jQuery object | sent via $(this) on the event object
        //element.children('i').animate({ left: '-1rem' });
        element.children('i').toggleClass('fas far slide-left text-danger');//toggles the solid vs outline version of this trash icon via Font Awesome classing, and initiates a css transition
        var deleteText = element.children('.delete-btn-text');
        deleteText.toggleClass('d-none shown');//show the element, but it will be transparent at start
        $('.delete-btn-text.shown').click(function () { exemptions.removeExemption($(this)); });
        setTimeout(function () { deleteText.removeClass('hidden') }, 700 );
    }//end: confirmDeletion method
    */

    exemptions.removeExemption = function () {
        var self = this;//should refer to the exemptions object itself
        var element = self.activeDeleteButton;//stored when the .delete-btn was pressed (before confirmation provided in exemption-deletion-modal)
        var inmateNum = element.attr('data-inmateNum');
        var empid = element.attr('data-employeeID');

        var data = { inmateNum: inmateNum, empid: empid };
        //post to the removeExempt action page:
        $.post('/exemptions/act/removeExempt.php', data, exemptions.removeExemptCallback);

        //Show a preloader on the current datatable row, before hiding it completely (similar to EVFS predecessor)
        var parentRow = element.parents('tr');
        parentRow.html(['<td colspan="8"><div class="d-flex justify-content-center text-center my-1">',
            '<div class= "spinner-grow text-danger " role = "status" >',
            '<span class="sr-only">Deleting</span>',
            '</div >',
            '</div ></td>'].join(''));
        self.activeDeleteButton = null;//user has to click another delete button to store information about subsequent deletions; won't accidentally reuse the same object
    }//end removeExemption method

    exemptions.removeExemptCallback = function (serverRes) {
        setTimeout(function () {//give the preloader (flashing row to demonstrate deletion) time to be visible to user...
            navigation.load('/exemptions/page/exemptionsList.php', { loadTimeout: 0, reinitialize: exemptions }).setActive('exemptionsList');//reload the exemptionslist (datatable without the deleted row)
        }, 1000);
    }//removeExemptCallback


    return exemptions;//return what we built
}
/**********************************************************************************EXEMPTIONS: Factory Function*****/

/*****IT_ALERTS: Factory Function**********************************************************************************/
function IT_ALERTS() {
    var ITalerts = {};//build this

    ITalerts.initialize = function () {
        $('.editAlert-btn').click(function () {//This button is on the activeAlerts page, to navigate to the newAlert page
            var alertID = $(this).attr('data-alertID');//unique database identifier for this alert record
            navigation.load('/ITalerts/page/editAlert.php?alertID=' + alertID, { loadTimeout: 500, reinitialize: ITalerts });
        })

        $('button.new-alert').click(function () {
            navigation.load('/ITalerts/page/newAlert.php', { loadTimeout: 500, reinitialize: ITalerts });
        });

        $('.newAlertForm .submit-btn').click(function () {//This button is on the activeAlerts page, to navigate to the newAlert page
            newAlertForm.submit();//dependency: PSEUDOFORM object
        })

        $('.editAlertForm .submit-btn').click(function () {//This button is on the activeAlerts page, to navigate to the newAlert page
            editAlertForm.submit();//dependency: PSEUDOFORM object
        })

        $('.newAlertForm .cancel-btn, .editAlertForm .cancel-btn').click(function () {//This button is on the activeAlerts page, to navigate to the newAlert page
            navigation.load('/ITalerts/page/activeAlerts.php', { loadTimeout: 500, reinitialize: ITalerts }).setActive('activeAlerts');
        })

        $('.removeAlert-btn').click(function () {
            //POST a remove request to the action page
            if ($(this).attr('data-confirmDelete')) {//have to click the delete button twice to trigger this action
                var data = { alertID: $(this).attr('data-alertID') };
                $.post('/ITalerts/act/removeAlert.php', data, ITalerts.databaseCallback);
            }
            $(this).html("<i class='mr-1 far fa-trash-alt'></i>Really delete?").addClass('danger-link');//so that it is red  //.css({'font-family':'Roboto'});
            $(this).attr('data-confirmDelete', 'clickAgainToConfirm');
        });

        //Set up some GIJGO datepickers:
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        $('#startDate').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            minDate: today,
            maxDate: function () {
                return $('#endDate').val();
            }
        });
        $('#endDate').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            minDate: function () {
                return $('#startDate').val();
            }
        });

        if ($('.editAlertForm').length > 0) {//Only want to force focus on the edit alert page (with existing message)
            setTimeout(function () { $('#alertMessageEntry').focus(); }, 250);
        }

    }//end initialize method

    ITalerts.databaseCallback = function (serverRes) {
        try {
            serverRes = JSON.parse(serverRes);
        } catch (error) {
            console.log(serverRes);//so we can debug if the JSON parse fails
        }
        if (serverRes["success"]) {
            navigation.load('/ITalerts/page/activeAlerts.php', { loadTimeout: 500, reinitialize: ITalerts }).setActive('activeAlerts');
        } else {
            if (serverRes["error"]) {
                var errorMessage = serverRes.error;
            } else {
                var errorMessage = 'Oops, something went wrong...';
            }
            notification.toast('#material-toast-bottom-right', errorMessage, '<i class="fas fa-frown fa-lg"></i>');//dependency on notification object methods (in meta.js)
        }
    }

    return ITalerts;//return what we built
}
/**********************************************************************************IT_ALERTS: Factory Function*****/

/*****FORMS: Factory Function**********************************************************************************/
function LCSOFORMS() {
    /*Specifically for uploading to the new forms page*/
    var forms = {};//initialize object, we will built this
    forms.uploadLock = false; //default: indicate true while a new form file/version is in the process of uploading, to temporarily prevent form editor saves

    forms.initialize = function () {
        var self = this;//should reference the forms object itself
        $('.help-guide').attr('data-helpTipsActive', 'false');//reset help guide, even if transitioning in the middle of playback

        //for activeForms page
        $('button.new-form').click(function () {
            navigation.load('/forms/page/formEditor.php', { loadTimeout: 200, reinitialize: forms });//simply reloads the active forms page (dependency: navigation object methods)
        });

        $('.file-link').click(function () {
            var formID = $(this).attr('data-formID');
            $.post('/forms/act/logAccess.php', { formID: formID, action: 'log' }, null);//url, data, callback
        });//we download via this link natively by directing to the filepath, but also want to log that it was opened/downloaded for usage stats

        $('.edit-form-btn').click(function () {
            var formTitle = $(this).attr('data-friendlyName');
            $('#edit-form-modal .modal-header .form-title').html(formTitle);//put the form title into the span waiting for form title (header of modal) since we already have it
            //Grab the necessary data values that we need to pass to generate a formEditor modal:
            var data = {};//initialize the blank object to fill with GET parameters
            data.formID = $(this).attr('data-formID');
            data.description = $(this).attr('data-description');
            data.dept = $(this).attr('data-dept');
            data.friendlyName = $(this).attr('data-friendlyName');
            data.doclink = $('a[data-formID=' + data.formID + ']').attr('href');//get the href of the matching link, in order to replicate in the editor
            //Then we will GET the formEditor page to enter into the modal body:
            $.get('/forms/page/formEditor.php', data, self.generateFormEditor);//url, data, callback
        });//event listener for edit form buttons 

        $('.usage-stats-btn').click(function () {
            var formID = $(this).attr('data-formID');
            $.get('/forms/act/logAccess.php', { formID: formID, action: 'history' }, self.showFormHistory);//url, data, callback
        });//we download via this link natively by directing to the filepath, but also want to log that it was opened/downloaded for usage stats

        $('.versions-btn').click(function () {
            var data = {
                formID: $(this).attr('data-formID'),
                action: 'history'//we want to see the version-history for this form
            };
            $.get('/forms/act/versionControl.php', data, self.showFormHistory);//url, data, callback
            //Will load the version history returned by /act/versionControl.php?action=history into the version-history-modal
        });//event listener for 


        forms.DataTable = $('.forms-table').DataTable({
            "paging": false, //disabled pagination
            //"columnDefs": [{ orderable: false, targets: [2] }],//array index of unsortable column (revised date)
        });//from MDB datatable plugin, stores the generated DataTable object as forms.DataTable, for access later (used for pre-filtering the forms with a GET request)

    }//end: intialize method

    forms.generateFormEditor = function (serverRes) {
        //the response coming back from the server is a generated body for the edit-form-modal, based on GET parameters we passed to it:
        $('#edit-form-modal .modal-body').html(serverRes);
        $('#edit-form-modal').modal('show');
    }

    forms.formEditCallback = function (serverRes) {
        //console.log(serverRes);
        navigation.load('/forms/page/activeForms.php', { loadTimeout: 200, reinitialize: forms }).setActive('activeForms');//simply reloads the active forms page (dependency: navigation object methods)
    }

    forms.needsRefresh = false;//default, for whether we need to reload the activeForms back in the background when we pop up the version history side modal,
    //needsRefresh will be true if we just updated the active version of the form
    forms.showFormHistory = function (serverRes) {
        var self = forms;//should refer to the forms object itself
        $('#form-history-modal .modal-body').html(serverRes);
        $('#form-history-modal').modal('show');
        //Establish listeners for the action buttons in the version history modal:
        $('#form-history-modal .version-rollback-btn').click(function () {

            self.needsRefresh = true;//so that the activeForms page will reload in the background 
            var versionID = $(this).attr('data-versionID');
            var data = {
                versionID: versionID,
                action: 'swap'//swap out the current version for this one
            };
            $.get('/forms/act/versionControl.php', data, self.showFormHistory);//url, data, callback
        });//listener for the version rollback btns
        if (self.needsRefresh) {
            navigation.load('/forms/page/activeForms.php', { loadTimeout: 400, reinitialize: forms }).setActive('activeForms');//reloads the active forms page in the background(dependency: navigation object methods)
            self.needsRefresh = false;//toggle back, since we did the refresh
        }
    }

    forms.archiveForm = function (formID) {
        var data = {
            formID: formID,
            action: 'archive'//swap out the current version for this one
        };
        $.get('/forms/act/versionControl.php', data, forms.formEditCallback);//url, data, callback
    }//end: archiveForm method

    return forms;//return what we built
}
/**********************************************************************************FORMS: Factory Function*****/


/*****POLICETRAK: Factory Function**********************************************************************************/
function POLICETRAK(landingZone) {
    var policetrak = {};//build this
    //@landingZone: string | queryselector for where we want search results data to be displayed
    policetrak.landingZone = $(landingZone);//defines the jQuery object for search results by a queryselector
    //var $self = this;//POLICETRAK object

    policetrak.deleteConfirmation = function () {
        var removalText = $('#remove-confirm').val();
        if (removalText.toUpperCase() === 'REMOVE') {//converting to upper case for the test, so that it isn't case sensitive for the user
            //Actually process the record removal:
            /* 
             //These elements are hidden in the arrest_details modal:
                $html.="<input type='hidden' name='KeyID' value='{$_GET['k']}'>";//needed to know which entry to edit
                $html.="<input type='hidden' name='tablename' value='{$_GET['t']}'>";//needed to know what table to update
             */
            var KeyID = $('#arrest-details-modal input.KeyID').val();//pulls from hidden input returned by arrest_details for this record
            var tablename = $('#arrest-details-modal input.tablename').val();//pulls from hidden input returned by arrest_details for this record
            $.post("expunge_seal.php", { k: KeyID, t: tablename }, null, 'json');//posts to the action page
            //Show the user that something is happening...
            $('#delete-confirmation-modal .entry-stuff').toggleClass('d-none');
            $('#delete-confirmation-modal .action-animation').toggleClass('d-none d-flex');
            setTimeout(function () {//this closes out the modal-window, hides action animation, reshows entry-stuff
                $('#remove-confirm').val('');//wipe the confirmation text input for reuse
                $('#delete-confirmation-modal .entry-stuff').toggleClass('d-none');
                $('#delete-confirmation-modal .action-animation').toggleClass('d-none d-flex');
                $('#delete-confirmation-modal').modal('hide')
                $('#arrest-details-modal').modal('hide');//Simulate clicking the close button for the modal
                window.location.href = '/PoliceTrak';//refresh the page to capture changes
            }, 1500);
        } else {
            $('.delete-confirmation-btn').addClass('animated');
            $('.delete-confirmation-btn').addClass('shake');
            setTimeout(function () { $('.delete-confirmation-btn').removeClass('shake') }, 3000);
        }
    }//end .deleteConfirmation method

    policetrak.modalDetails = function (serverRes) {
        //This callback function is intended to display a modal with details about that arrest.
        //Create the modal contents based on server response data:

        $('#arrest-details-modal .modal-title').html(serverRes.title);
        $('.modal-buttons-wrap').remove();//if there are prior installed custom modal buttons, destroy them before we make more...
        if (serverRes.buttons) { $('#arrest-details-modal .modal-title').after(serverRes.buttons) };//if buttons have been included in the response
        $('#arrest-details-modal .modal-body').html(serverRes.html);//insert the returned content in the modal sidebar before displaying it.
        $('#arrest-details-modal').modal('show');

        //Initialize some event listeners on newly created elements:
        //If the user clicks the "Show More" button on modal details, they get the moreDetails div to show:
        $('#arrest-details-modal .moreDetail-btn').click(function () {
            $('#arrest-details-modal .moreDetails').removeClass('d-none');//removes the display none class, effectively making it visible   
            $(this).hide();//no more details button needed, since they already clicked on it
        });

        //A user won't see this button unless they are a PoliceTrak admin, but it requests the edit form version of this modal if they click it.
        $('#arrest-details-modal a.edit-btn').click(function () {
            var KeyID = $(this).attr('data-detailFor');
            var tablename = $(this).attr('data-detailsFrom');
            $.get("arrest_details.php", { k: KeyID, t: tablename, edit: 'true' }, policetrak.modalDetails, 'json');//we will request to edit this page (which will check that we have admin acces serverside)
        });

        //This cancel button only exists on the editing version of the modal (Policetrak admin only)
        $('#arrest-details-modal .cancel-btn').click(function () {
            $('#arrest-details-modal').modal('hide');//close the modal
        });


        $('.expunge-btn').click(function () {
            $('#remove-confirm').val('');//resets the confirmation text input, in case it was used previously
            $('#delete-confirmation-modal').modal('show');//shows a subsequent confirmation modal for expungment/seal orders  
        });

        //The pseudo submit button posts, but doesn't change pages (just closes the modal)
        $('#arrest-details-modal .pseudo-submit-btn').click(function () {//click listener for the button in this form
            var data = {};//uses a plain object for form data
            $('#arrest-details-modal form input, #arrest-details-modal form text-area').each(function () {
                var key = $(this).attr('name');
                var value = $(this).val();
                if (value && value.length > 0) { data[key] = value };//stores this key-value pair into the data we will post with our search query, only if it is valid
            });//function for each input 
            //Now post the query:
            $.post('/PoliceTrak/updateRecord.php', data, policetrak.editConfirmation);
            $('#arrest-details-modal .close').click();//Simulate clicking the close button for the modal
        });
    }//end modalDetails method

    policetrak.pseudoSearch = function (element) {
        /*
            * element: jQuery object | passed in by event listener via $(this)
            * @data-source >> $source: string | the php page identifier for what search we are running
            * @data-landing >> $landing: string | querySelector for where the returned html should be placed (the landing pad)
            * NOTE: the naming convention for input names MUST match the col header of the table we are looking up. 
        */
        var data = {};//uses a plain object
        $('form.pseudo-form input, form.pseudo-form text-area').each(function () {
            var key = $(this).attr('name');
            var value = $(this).val();
            if (value && value.length > 0) { data[key] = value };//stores this key-value pair into the data we will post with our search query, only if it is valid
        });//function for each input 
        //Now post the query:
        if (element.parents('.pseudo-form').attr('data-source') == 'arrests') {
            $.post('./search_results.php', data, policetrak.searchCallback);
        } else if (element.parents('.pseudo-form').attr('data-source') == 'names') {
            $.post('./names_results.php', data, policetrak.searchCallback);//will swap to names results
        }
    }//end pseudoSearch

    policetrak.editConfirmation = function (serverRes) {
        console.log(serverRes);
    }

    //Helper callback funcion
    policetrak.searchCallback = function (serverRes) {
        policetrak.landingZone.html(serverRes);//put the html response in the landing div
        //Attach event listeners to new links which generate a more detail page 
        // FIX: I had to initialize this event listener for achor links BEFORE turning on the datatable, because the click listener wasn't getting attached to elements which were vanished by the default datatable pagination = much easier than reattaching event listeners each time you change pagination for the table
        $('a.detail-btn').click(function () {
            var KeyID = $(this).attr('data-detailFor');
            var tablename = $(this).attr('data-detailsFrom');
            $.get("/PoliceTrak/arrest_details.php", { k: KeyID, t: tablename }, policetrak.modalDetails, 'json');//properties k and t are only slightly obfuscated...
        });

        //Apply event listeners to tabs:
        $('.tab').click(function () {
            //1. Control the tabs appearance:
            $('.tab.selected').toggleClass('selected deselected');//we have to turn off the existing selected tab first
            $(this).toggleClass('selected deselected');
            //2. Control the content:
            var target = $(this).attr('data-tab');
            target = 'div[data-tabContent=' + target + ']';//modify for the relevant queryselector string
            $('.tab-content').addClass('deselected');//hide them all!
            $(target).removeClass('deselected');//unhide the selected one
        });

        //initialize a datatable on the returned data, sorted by last name column (index 1).
        policetrak.landingZone.find('.table').DataTable({ "order": [[1, "asc"]] });//looks for a child of the landing zone with the class table (just generated it on search resuls callback)
        $('.dataTables_filter label').prepend('Refine ');//rename subsequent search bar as "Refine Search" 
    }//end callback function

    return policetrak;//return what we built
}
/**********************************************************************************POLICETRAK: Factory Function*****/

/*****SENIORWATCH: Factory Function****************************************************************************/
function SENIORWATCH() {
    var seniorwatch = {};//we will build this
    seniorwatch.newContactCounter = 0;//initialize this value, which counts how many new Contacts were added in the senior details/add senior page

    seniorwatch.initialize = function () {
        seniorwatch.newContactCounter = 0;//reset the counter for new contacts
        $('.help-guide').attr('data-helpTipsActive', 'false');//reset help guide, even if transitioning in the middle of playback
        $('.contact-history-btn').click(function () {
            var seniorID = $(this).attr('data-seniorID');//so we know who to get the history for
            $.get('/seniorwatch/act/getContactHistory.php', { seniorID: seniorID }, seniorwatch.historyCallback);//url, data, callback
        });//contact history btn

        $('.senior-details-btn').click(function () {
            var seniorID = $(this).attr('data-seniorID');//so we know who to get the history for
            var inactive = $(this).attr('data-inactive');//will be 'true' on the inactiveSeniors page, undefined otherwise
            var data = { seniorID: seniorID };
            if (inactive) data.inactive = 'true';//also pass along this if we know the senior is already inactive (on the inactiveSeniors page)
            $.get('/seniorwatch/page/seniorDetails.php', data, seniorwatch.detailsCallback);//url, data, callback
        });//senior details btn

        $('.add-comment-btn').click(function () {
            var seniorID = $(this).attr('data-seniorID');
            $('#post-comment-modal .modal-title').html('Comment for Senior #' + seniorID);
            $('#post-comment-modal .modal-body').html("<input type='text' class='w-100' name='commentText' data-seniorID='" + seniorID + "'>");
            $('#post-comment-modal').modal('show');
        })//add comment btn

        $('.confirm-contact-btn').click(function () {
            var seniorID = $(this).attr('data-seniorID');
            $.post('/seniorwatch/act/recordContact.php', { seniorID: seniorID }, seniorwatch.confirmContactCallback);//url, data, callback
        });

        $('.download-btn').click(function () {
            xport.toCSV('seniorTbl');//references the senior table in active seniors or call list (not added to inactive seniors at this time)
        });//download senior table

        ////New senior page (mimics many events from the seniorDetails, though seniorDetails serves in a modal):
        //This is a textarea autoresize script:
        $('#new-senior-form textarea').keydown(function () {
            var text = $(this);
            text.height('auto');
            text.height(text.prop('scrollHeight'));
        });//textarea autoresize
        setTimeout(function () { $('#new-senior-form textarea').keydown(); }, 200);//manually trigger the resize...

        $('#new-senior-form .submit-btn').click(function () {
            newSenior.submit();// dependency: PSEUDOFORM method and the newSenior object we created in the app's funcs.php
        });//event listener for edit button


        $('#new-senior-form .cancel-btn').click(function () {
            //reload the active seniors page (since we decided not to add a new senior)
            var loadUrl = '/seniorwatch/page/activeSeniors.php';//define the actual path the the active seniors page, so that we can reload it
            navigation.load(loadUrl, { loadTimeout: 100, reinitialize: seniorwatch }).setActive('activeSeniors');;//reload the active seniors page | dependency: NAVIGATION methods
        });//event listener for cancel button :: newSenior page

        $('#new-senior-form .add-contact-btn').click(function () {
            seniorwatch.newContactCounter++;//increment for a new Contact
            var newCounter = seniorwatch.newContactCounter;
            $('#new-senior-form .contact-section').append(
                ["<div class='row col-12 mb-3'><div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend' >",
                    "<span class='input-group-text'>Relationship</span>",
                    "</div>",
                    "<input name='contact-relationship-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Relationship to Senior' >",
                    "</div>",
                    "<div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend'>",
                    "<span class='input-group-text'>Phone</span>",
                    "</div>",
                    "<input name='contact-phone-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Contact Phone #' >",
                    "</div>",
                    "<div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend'>",
                    "<span class='input-group-text'>First Name</span>",
                    "</div>",
                    "<input name='contact-firstname-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Contact First Name'>",
                    "</div>",
                    "<div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend'>",
                    "<span class='input-group-text'>Last Name</span>",
                    "</div>",
                    "<input name='contact-lastname-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Contact Last Name' >",
                    "</div></div>"].join(''));
        });//event listener: add contact button :: newSenior page

        //Call getSeniors action page everytime we initialize the page!
        $.get('/seniorwatch/act/countSeniors.php', null, seniorwatch.countSeniorsCallback);//url, data, callback

        // FIX: We need to initialize the datatable on the page AFTER initializing buttons, because otherwise the button elements aren't where we can get target them (get hidden by the datatable)
        $('.table.active-seniors').DataTable({
            "paging": false, //disabled pagination upon request from comm center users.
            columnDefs: [{ orderable: false, targets: [3, 4, 5] },//array index of unsortable columns

            { searchable: true, targets: [0, 1, 2] },//array of searchable columns
            { searchable: false, targets: "_all" }, //default that columns aren't searchable, except those we specifically targeted already 
            ],
            order: [[0, "asc"]]//indicates to sort by column 'ID #' in ascending order
        });//convert active seniors to DataTable

        $('.table.inactive-seniors').DataTable({
            "paging": true, //enable pagination (there are a lot of inactive seniors...)
            "pageLength": 100,//by default, show top 100
            columnDefs: [{ orderable: false, targets: [3, 4] },//array index of unsortable columns
            { searchable: true, targets: [0, 1, 2] },//array of searchable columns
            { searchable: false, targets: "_all" }, //default that columns aren't searchable, except those we specifically targeted already 
            ],
            order: [[2, "asc"]]//indicates to sort by last name, in ascending order
        });//convert active seniors to DataTable
    }//end: initialize method

    seniorwatch.countSeniorsCallback = function (serverRes) {
        //Should add the current count returned by ./act/countSeniors.php
        //console.log(serverRes);
        $('.callListCount').html(serverRes.callList);
        $('.activeCount').html(serverRes.activeSeniors);
        $('.inactiveCount').html(serverRes.inactiveSeniors);
        //console.log('Call List is ' + serverRes.call);
        //console.log('Active is ' + serverRes.active);
        //console.log('Inactive is ' + serverRes.inactive);
    }//end: countSeniorsCallback

    seniorwatch.historyCallback = function (serverRes) {
        //serverRes.title: "Contact History for [senior#]" => modal title
        //serverRes.body: the list => modal body
        $('#contact-history-modal .modal-title').html(serverRes.title);
        $('#contact-history-modal .modal-body').html(serverRes.body);
        $('#contact-history-modal').modal('show');//display the modal, after inputting the returned contact history list

        //Attach event listener for the 'undo contact' button (allows a user to cancel a contact they record accidentally, placing the senior back on the call list for today)
        $('.undo-contact-btn').click(function () {
            var historyID = $(this).attr('data-historyID');
            $.post('/seniorwatch/act/cancelContact.php', { historyID: historyID }, null);//url, data, callback
            console.log('Cancelling contact for senior #' + historyID);//we will hide the li in reality
            $(this).closest('li').hide();//traverses up the DOM tree to the list item that this button is within, then hides it.
        })



        $('#contact-history-modal .show-all-contact-history').click(function () {//attach event listener that allows all contact history to be requested
            var seniorID = $(this).attr('data-seniorID');//so we know who to get the history for
            $.get('/seniorwatch/act/getContactHistory.php', { seniorID: seniorID, all: 'true' }, seniorwatch.historyCallback);//url, data, callback
        });//attach event listener that allows all contact history to be requested
    }//end: historyCallback

    seniorwatch.confirmContactCallback = function (serverRes) {
        var loadUrl = '/seniorwatch/page/callList.php';//define the actual path the the active page, so that we can reload it
        navigation.load(loadUrl, { loadTimeout: 100, reinitialize: seniorwatch });//reload the active page | dependency: NAVIGATION methods
        //reload the callList page (since all confirm contact interactions take place from the calllist page)
    }

    seniorwatch.addSeniorCallback = function (serverRes) {
        var loadUrl = '/seniorwatch/page/activeSeniors.php';//define the actual path the the active seniors page, so that we can reload it
        navigation.load(loadUrl, { loadTimeout: 100, reinitialize: seniorwatch }).setActive('activeSeniors');;//reload the active seniors page | dependency: NAVIGATION methods
    }//end: addSeniorCallback 

    seniorwatch.detailsCallback = function (serverRes) {
        //serverRes.title: "Contact History for [senior#]" => modal title
        //serverRes.body: the list => modal body
        seniorwatch.newContactCounter = 0;//reset the counter for new contacts
        $('#senior-details-modal .modal-title').html(serverRes.title);
        $('#senior-details-modal .modal-body').html(serverRes.body);//insert the details content | if it was previously red from an inactivation, turn that off
        $('#senior-details-modal').modal('show');//display the modal, after inputting the returned contact history list
        //This is a textarea autoresize script:
        $('#senior-details-modal textarea').keydown(function () {
            var text = $(this);
            text.height('auto');
            text.height(text.prop('scrollHeight'));
        });//textarea autoresize
        setTimeout(function () { $('#senior-details-modal textarea').keydown(); }, 200);//manually trigger the resize...

        $('#senior-details-modal .submit-btn').click(function () {
            var seniorID = $(this).attr('data-seniorID');//request the same details modal, but set to edit 
            var inactiveStatus = $(this).attr('data-inactive');
            var data = { seniorID: seniorID };//basic info
            if (inactiveStatus == 'true') {
                data.setInactive = 'true';
            }
            editDetails.submit(data);//submits extra value(s), along with the data we find in inputs within the target form | dependency: PSEUDOFORM method
        });//event listener for submit button

        $('#senior-details-modal .edit-btn').click(function () {
            var seniorID = $(this).attr('data-seniorID');//request the same details modal, but set to edit 
            var inactive = $(this).attr('data-inactive');//will be 'true' on the inactiveSeniors page, undefined otherwise
            var data = { seniorID: seniorID, edit: 'true' };
            if (inactive) data.inactive = 'true';//also pass along this if we know the senior is already inactive (on the inactiveSeniors page)
            $.get('/seniorwatch/page/seniorDetails.php', data, seniorwatch.detailsCallback);//url, data, callback
        });//event listener for edit button

        $('#senior-details-modal .add-comment-btn').click(function () {
            $('#senior-details-modal').modal('hide');//if you accessed the comment input modal from the senior details page, we want to close that senior details modal (to force the user to reload it with fresh info if they add a comment)
            var seniorID = $(this).attr('data-seniorID');
            $('#post-comment-modal .modal-title').html('Comment for Senior #' + seniorID);
            $('#post-comment-modal .modal-body').html("<input type='text' class='w-100' name='commentText' data-seniorID='" + seniorID + "'>");
            $('#post-comment-modal').modal('show');
        })//add comment btn (only within the senior details modal, because there are a bunch on the main page)

        $('#senior-details-modal .cancel-btn').click(function () {
            $('#senior-details-modal').modal('hide');//simply close the modal without submitting data
        });//event listener for cancel button

        $('#senior-details-modal .add-contact-btn').click(function () {
            seniorwatch.newContactCounter++;//increment for a new Contact
            var newCounter = seniorwatch.newContactCounter;
            $('#senior-details-modal .contact-section').append(
                ["<div class='row col-12 mb-3'><div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend' >",
                    "<span class='input-group-text'>Relationship</span>",
                    "</div>",
                    "<input name='contact-relationship-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Relationship to Senior' >",
                    "</div>",
                    "<div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend'>",
                    "<span class='input-group-text'>Phone</span>",
                    "</div>",
                    "<input name='contact-phone-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Contact Phone #' >",
                    "</div>",
                    "<div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend'>",
                    "<span class='input-group-text'>First Name</span>",
                    "</div>",
                    "<input name='contact-firstname-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Contact First Name'>",
                    "</div>",
                    "<div class='input-group nowrap mb-3 col-6'>",
                    "<div class='input-group-prepend'>",
                    "<span class='input-group-text'>Last Name</span>",
                    "</div>",
                    "<input name='contact-lastname-new" + newCounter + "' type='text' class='form-control nowrap'  aria-label='Contact Last Name' >",
                    "</div></div>"].join(''));
        });//event listener: add contact button

        $('#senior-details-modal .more-comments-btn').click(function () {
            var seniorID = $(this).attr('data-seniorID');//request the same details modal, but with the request to load ALL comments for the senior (could be a bunch)
            $.get('/seniorwatch/page/seniorDetails.php', { seniorID: seniorID, allComments: 'true' }, seniorwatch.detailsCallback);//url, data, callback
        });//event listener for more comments

        $('#senior-details-modal #inactive-switch').click(function () {
            $('#senior-details-modal .inactive-section').toggleClass('d-none');//appears red
            //Determine if the submit button is tagged with a data-inactive='true'
            if ($(this).prop('checked')) {
                $('#senior-details-modal .submit-btn').attr('data-inactive', 'true');//because we are toggling on | Note: the default state if we opened the senior details modal under an edit request and the senior was already inactive
            } else {
                $('#senior-details-modal .submit-btn').attr('data-inactive', 'false');//because we are toggling off
            }
        });//event listener for inactive switch


        //for inactivesection
        $('#dateFromInput:not(.disabled)').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            format: 'yyyy-mm-dd'
        });
        $('#dateToInput:not(.disabled)').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            format: 'yyyy-mm-dd'
        });
        //To enforce unselectable, but still styled datepickers, set the maxdate to 1900-01-01
        var oldAndInvalid = new Date('1900', '00', '01');
        $('#dateFromInput.disabled').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            format: 'yyyy-mm-dd',
            maxDate: oldAndInvalid
        });
        $('#dateToInput.disabled').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            format: 'yyyy-mm-dd',
            maxDate: oldAndInvalid
        });


    }//end: detailsCallback

    seniorwatch.seniorEditCallback = function (serverRes) {
        //Close the modal and reload the page you are currently on after the details are processed server-side
        //console.log(serverRes);
        $('#senior-details-modal').modal('hide');
        var activePage = $('.nav-item.active').attr('data-page');//the title of the currently active page
        var loadUrl = '/seniorwatch/page/' + activePage + '.php';//define the actual path the the active page, so that we can reload it
        navigation.load(loadUrl, { loadTimeout: 500, reinitialize: seniorwatch });//reload the active page | dependency: NAVIGATION methods
    }

    seniorwatch.commentCallback = function (serverRes) {
        $('#post-comment-modal').modal('hide');//close the comment modal (should be the only visible modal, and any other details will get reloaded when you pull up senior details)
    }

    return seniorwatch;//return what we built
}
/****************************************************************************SENIORWATCH: Factory Function*****/

/*****SPILLMAN: Factory Function****************************************************************************/
function SPILLMAN() {
    var spillman = {};//we will build this
    spillman.initialize = function () {
        //for sylogResults page:
        var today = new Date();//today
        todayyear = (today.getYear() + 1900);//we have to add to the year 1900
        todaymonth = (today.getMonth() + 1);//and a zero-indexed month to get this datestring as yyyy-mm-dd
        if (todaymonth.toString().length < 2) todaymonth = '0' + todaymonth;//prepend a zero to get 2 digits, if needed
        todayday = today.getDate();
        if (todayday.toString().length < 2) todayday = '0' + todayday;//prepend a zero to get 2 digits, if needed
        todaystring = todayyear + '-' + todaymonth + '-' + todayday//to get this datestring as yyyy-mm-dd 

        var past = new Date();//initialize at today as starting date
        past.setTime(past.getTime() - 1 * 24 * 60 * 60 * 1000);//sets the time 1 day ago (via miliseconds * minutes * hours * days)
        pastyear = (past.getYear() + 1900);//we have to add to the year 1900
        pastmonth = (past.getMonth() + 1);//and a zero-indexed month to get this datestring as yyyy-mm-dd
        if (pastmonth.toString().length < 2) pastmonth = '0' + pastmonth;//prepend a zero to get 2 digits, if needed
        pastday = past.getDate();
        if (pastday.toString().length < 2) pastday = '0' + pastday;//prepend a zero to get 2 digits, if needed
        past = pastyear + '-' + pastmonth + '-' + pastday//to get this datestring as yyyy-mm-dd

        $('#dateFromInput').datepicker({
            uiLibrary: 'materialdesign',
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            maxDate: today,
            format: 'yyyy-mm-dd',
            value: past
        });
        $('#dateToInput').datepicker({
            iconsLibrary: 'fontawesome',
            keyboardNavigation: true,
            maxDate: today,
            format: 'yyyy-mm-dd',
            value: todaystring
        });//initialize datepicker plugin for these elements (GIJGO)

        $('.sylogSearch .submit-btn').click(function () {
            $('.searchresults-wrapper').html(['<div class="col-12 row justify-content-center my-5">',
                '<div class= "spinner-grow text-primary" role = "status" >',
                '<span class="sr-only">Loading...</span>',
                '</div >',
                '</div >'].join(''));//using an array.join() for IE friendly, since IE can't interpret interpolated strings...
            sylogSearchForm.submit();//check if it is complete and give feedback to user if it isn't (by default 'this is a required field!' messages), then POST without page reload...
        });//click for cancel button if on newOrder page
        $('.sylogSearch .search-text').on('keyup', function (event) {//simulate clicking submit if you click 'enter' while typing in the search text
            if (event.keyCode === 13) { event.preventDefault(); $('.sylogSearch .submit-btn').click(); }
        })

    }//end initialize method


    spillman.sylogSearchCallback = function (serverRes) {//gets the content of the page, ready to load into .sub-content via navigation?

        $('.searchresults-wrapper').html(serverRes);//using the standard navigation object (loads instantly, no preloader)
    }

    return spillman;//return what we built
}
/****************************************************************************SPILLMAN: Factory Function*****/

/*****SUPPLEMENTS: Factory Function****************************************************************************/
function SUPPLEMENTS() {
    //Used to submit supplements to report writers 
    var supplements = {};//we will build this
    supplements.initialize = function () {
        $('.fa-question-circle').tooltip({
            placement: 'bottom',
            //title: 'You will find case #&apos;s in the dropdown for which you have submitted a UCR addendum in the past 60 days.',
            //trigger: 'manual',
            html: true//allow html inserts in text for the tooltip
        });
        $('select[name=cases]').change(function () {
            //load the getAddendum text for this case, and show the update button, on callback
            var uniqueRef = $(this).val();//cases are selected by sha1 uniqueRef (not case number) so that querystrings which link to this can be unpredictable
            $.get('/UCR/act/getAddendums.php', { uniqueRef: uniqueRef }, supplements.addendumObtained);//url, data, callback
        });


        $('.new-addendum-btn').click(function () {
            $('#newAddendum-modal input').val('');//wipe any pre-existing inputs (caseNum)
            $('#newAddendum-modal').modal('show');
        });

        $('.update-btn').click(function () {
            var uniqueRef = $('select[name=cases]').val();//used to update that existing UCR
            navigation.load('/UCR/page/addendumForm.php?uniqueRef=' + uniqueRef, { loadTimeout: 500, reinitialize: supplements });
        });

        $('.supplementForm .submit-btn').click(function () {
            console.log('submitting...');
            supplementForm.submit();//dependency on PSEUDOFORM object
        });

        $('.supplementForm .cancel-btn').click(function () {
            var uniqueRef = $(this).attr('data-uniqueRef');//used to redirect back to display this addendum (unedited) on addendumDisplay page
            navigation.load('/UCR/page/addendumDisplay.php?uniqueRef=' + uniqueRef, { loadTimeout: 500, reinitialize: supplements });
        });

        $('.continue-btn').click(function () {
            var uniqueRef = $(this).attr('data-uniqueRef');//used to display the specific UCR addendum from getAddendum
            navigation.load('/UCR/page/addendumDisplay.php?uniqueRef=' + uniqueRef, { loadTimeout: 500, reinitialize: supplements });
        });
    }//end: intialize method

    supplements.addendumCreated = function (uniqueRef) {
        /*The createAddendum action page will return either the newly created uniqueRef (or the already existing)
          We will then direct the user to the addendumForm for that uniqueRef. (Don't forget to hide the newAddendum modal) */
        console.log(uniqueRef);//DEV ONLY//
        $('#newAddendum-modal').modal('hide');
        if (uniqueRef == 'error') {
            notification.toast('#material-toast-bottom-right', 'There was an error adding that case number.', '<i class="fas fa-exclamation-triangle"></i>');//dependency on notification object methods (in meta.js)
        } else {//assumes the server res is a usable uniqueRef sha1 string
            navigation.load('/UCR/page/addendumForm.php?uniqueRef=' + uniqueRef, { loadTimeout: 500, reinitialize: supplements });
        }
    }//end: addendumCreated

    supplements.submitCallback = function (serverRes) {
        //console.log(serverRes);
        if (serverRes == 'error') {
            notification.toast('#material-toast-bottom-right', 'There was an error recording your submission.', '<i class="fas fa-exclamation-triangle"></i>');//dependency on notification object methods (in meta.js)
        } else {//assumes the server res is a uniqueRef sha1 string (assigns a data value to the continue button on completedSubmission page)
            navigation.load('/UCR/page/completedSubmission.php?uniqueRef=' + serverRes, { loadTimeout: 500, reinitialize: supplements });
        }
    }//end: submitCallback

    supplements.addendumObtained = function (serverRes) {
        console.log(serverRes);
        $('.addendum-display').html(serverRes);//display the addendum details
        $('.update-btn').removeClass('d-none');//display this update button, if it was not already visible
    }//end: submitCallback

    return supplements;//return what we built
}
/****************************************************************************SUPPLEMENTS: Factory Function*****/

/*****SURVEYS: Factory Function****************************************************************************/
function SURVEYS() {
    var surveys = {};//we will build this
    surveys.surveyName = '';//will need to get filled by click events on passcode entry links
    surveys.pathToSurvey = '';//will need to get filled by click events on passcode entry links
    surveys.initialize = function () {
        var self = surveys;//refers to the surveys object itself (NOTE: named here when the factory func is executed, doesn't matter what you call the result on the client-side)
        //for external survey submissions page(s):
        $('.survey-link.no-passcode').click(function () {//for survey links with no passcode (just get the survey content)
            var pathToSurvey = $(this).attr('data-url');
            surveys.surveyName = $(this).attr('data-surveyName');//we stored in a data attribute the name of the survey are trying to confirm, and for awareness of which survey we are working with when doing custom submission validation
            $.get(pathToSurvey, null, surveys.nopasscodeCallback);//url, data, callback
        });//event listener for survey links with no passcode

        if (surveys.surveyName == 'BassTourney') {//For the bass tournament, we want to switch a Paypal button on only when the form fields are ready to submit
            $('input').on('change', function () {
                if (surveyForm.validityCheck(false) && $('#rulesConfirm').prop('checked')) {//runs the validity check without displaying user feedback about what is incomplete
                    $(window).off('beforeunload');//remove the alert that your changes are unsaved
                    $('.submit-not-ready').addClass('d-none');//swap the visibility
                    $('.submit-ready').removeClass('d-none');//swap the visibility
                }
            });
        }//display paypal payment button when the form is complete and ready to submit


        $('.submit-ready .paypal-submit-trigger').on('click touch', function () {//This is detecting the Paypal image which is the default submit button
            //Had to attach this event listener to the paypal image itself in order for both touch and click events to work as intended
            surveyForm.submit();//submits (to temp submission database) upon clicking to the paypal payment form
            $('.submit-ready .paypal-submit').click();//trigger the submit form
        });

        $('.submit-ready form').on('submit', function () {
            surveyForm.submit();//a fallback in case we missed the click event that is supposed to trigger the submit to temp database when paypal button is clicked
        });


        $('#passcode-modal input.passcode').val('');//wipe any automatic pre-fills in the passcode entry
        $('.survey-link.passcode-entry').click(function () {//for surveys that require a passcode first
            $('#passcode-modal').modal('show');//show the confirmation modal when you click on the confirmation
            surveys.surveyName = $(this).attr('data-surveyName');//we stored in a data attribute the name of the survey are trying to confirm, and for awareness of which survey we are working with when doing custom submission validation
            surveys.pathToSurvey = $(this).attr('data-url');//we stored in a data attribute on the passcode-entry (on allSurvey's page) the path to survey page that they are trying to confirm
        });//event listeners for survey links with a passcode

        $('input.passcode').keyup(function (event) {
            if (event.keyCode === 13) {
                event.preventDefault(); $('.passcode-confirmation-btn').click();//simulate submit button click if the user hits enter while typing their passcode
            }
        });

        $('.public-survey-page .sub-content-nav').click(function () {//we need to turn back on a "Submit another LCSO survey." link, but only on the public page
            var loadUrl = $(this).attr('data-url'); //var activePage = $(this).parent().attr('data-page');//quick naming to simplify the following line
            navigation.load(loadUrl, { loadTimeout: 500, reinitialize: surveys }); //.setActive(activePage);//get the sub-content, set the active navbar tab, and run the reinitialize method in fileshare object
            //Note: we need the object that we run reinitialize on to be defined, and should have an initialize method build into it (created in meta.js)
        });

        $('#passcode-modal .passcode-confirmation-btn').click(function () {
            //console.log($('input.passcode').val() + ' was the code attempt.');
            var data = {
                passcode: $('input.passcode').val()
            }
            $.post(self.pathToSurvey, data, self.passcodeConfirm);//url, data, callback
        });

        $('.submit-btn').click(function () {
            $(window).off('beforeunload');//remove the alert that your changes are unsaved
            var meetSubmissionRules = true;
            //For Bass Tournament, the box that confirms they have read and understand the rules must be checked before submission
            if (surveys.surveyName == 'BassTourney') {
                if (!$('#rulesConfirm').prop('checked')) {
                    meetSubmissionRules = false;
                    var element = $('#rulesConfirm');
                    element.tooltip({ title: 'You must confirm before submitting', trigger: 'manual', placement: 'bottom' });//if it isn't valid, tell them!
                    element.tooltip('show');
                    (function () { setTimeout(function () { element.tooltip('hide'); }, 4000) })(element);//Immediately executable! (to hide the tooltip)
                }
            }//end: specific rules for BassTournament registration

            //For TacMed registrations, we need to double check that the 5th and 6th participants (which are optional) have a valid email address if they have a name provided
            if (surveys.surveyName == 'TacMed') {
                if ($('input[name=membername5]').val() != '' && ($('input[name=email5]').val() == '' || !$('input[name=email5]')[0].checkValidity())) {
                    meetSubmissionRules = false;
                    var element = $('input[name=email5]');
                    element.tooltip({ title: 'You need to fill out this field before submitting', trigger: 'manual', placement: 'bottom' });//if it isn't valid, tell them!
                    element.tooltip('show');
                    (function () { setTimeout(function () { element.tooltip('hide'); }, 4000) })(element);//Immediately executable! (to hide the tooltip)
                }

                //check that they confirmed the agencyConfirm checkbox:
                if (!$('#agencyConfirm').prop('checked')) {
                    meetSubmissionRules = false;
                    var element = $('#agencyConfirm');
                    element.tooltip({ title: 'You must confirm before submitting', trigger: 'manual', placement: 'bottom' });//if it isn't valid, tell them!
                    element.tooltip('show');
                    (function () { setTimeout(function () { element.tooltip('hide'); }, 4000) })(element);//Immediately executable! (to hide the tooltip)
                }
            }//end: specific rules for TacMed registration

            if (meetSubmissionRules) {//only submit if the submission requirements were met
                surveyForm.submit();//uses a PSEUDOFORM object method, the purpose of this one is to record the input fields in the sql database
                //DEPRECATED (email notifications now handled through the recordSubmission action page) || emailNotifications.submit();//also uses a PSEUDOFORM object method, the purpose of this one is just to notify people of their liability releases to sign
            }
        });

        //for internal survey results page(s):
        $('.survey-results-link').click(function () {//uses the encoded surveyID to GET results datatable page
            var surveyID = $(this).attr('data-surveyID');
            var data = { surveyID: surveyID };
            $.get('/surveys/page/surveyResults.php', data, self.resultsCallback);//url, data, callback
        });//link to get the survey results page

        $('.download-to-csv').unbind();//remove any pre-existing event listeners on this button, so we don't get duplicates
        $('.download-to-csv').click(function () {
            if ($('#surveyResults').length == 0) {//if we haven't loaded survey results, tell the user they goofed (see notification toast in /surverys/inc/modals.php)
                //DEPRECATED Toast alert: we used to alert the user that they tried to download before they had specified any results to show; now we just don't let them see the download link until they choose a survey to download
                //notification.toast('#material-toast-bottom-right', 'You need to open a survey first...', '<i class="fas fa-laugh-wink fa-lg"></i>');//dependency on notification object methods (in meta.js)
            } else {
                xport.toCSV('surveyResults');//looks for a table with the specified ID, which will also be the filename of the download (uses tableToCsv plugin)
            }
        });
    }//end initialize method

    surveys.passcodeConfirm = function (serverRes) {
        var self = surveys;//refers to the surveys object itself
        if (serverRes == 'incorrect passcode') {
            micron.getEle('.passcode-confirmation-btn').interaction('shake').duration(0.45).timing('ease-in-out');//microinteraction - dependency: micron plugin
        } else {
            $('#passcode-modal').modal('hide');//close the confirmation modal, because they were correct
            $('.sub-content').html(serverRes);//load the resulting form into middle .sub-content
            self.initialize();//reinitialize the surveys components

            //Add an alert that you have unsaved inputs (we will need to remove this listener when the submit button is pressed, to not give false alarms):
            $(window).on('beforeunload', function () { return "Leave site? Changes you made will not be saved."; });
        }
    }//end: password confirm method

    surveys.nopasscodeCallback = function (serverRes) {
        $('.sub-content').html(serverRes);//load the resulting form into middle .sub-content
        surveys.initialize();//reinitialize the surveys components

        //Add an alert that you have unsaved inputs (we will need to remove this listener when the submit button is pressed, to not give false alarms):
        $(window).on('beforeunload', function () { return "Leave site? Changes you made will not be saved."; });
    }//end: callback for surveys that don't require a passcode

    surveys.submissionCallback = function (serverRes) {
        $('.sub-content').html(serverRes);//load the resulting confirmation into middle .sub-content
        surveys.initialize();//so that they provided nav link will work
    }

    surveys.emailNotifyCallback = function (serverRes) {
        console.log(serverRes);//load the resulting confirmation into middle .sub-content
    }

    surveys.resultsCallback = function (serverRes) {//I know, redundant from submissionCallback, but just keeping it semantic...
        $('.sub-content').html(serverRes);//load the resulting confirmation into middle .sub-content
        $('table.results-table').DataTable({
            scrollX: '100%',//to accomodate really wide tables
            pageLength: 100, //set default page length to 100
            order: [[0, "desc"]]//we are leading with submission datestamp, so we are sorting by that to put newest submissions first
        });//uses MDB datatable plugin
        $('.download-to-csv').removeClass('d-none');//allows the download link in the navbar to be visible after loading the internal content of survey results
        surveys.initialize();
    }//end: resultsCallback method

    return surveys;//return what we built
}
/****************************************************************************SURVEYS: Factory Function*****/



/*****NETWORKSTATUS: Factory Function****************************************************************************/
function NETWORKSTATUS() {
    var networkStatus = {};//we will build this

    networkStatus.initialize = function () {
        $('.site-to-site table').DataTable({ paging: false, order: [[3, 'desc'], [0, 'asc']] });
        $('.site-to-site .dataTables_wrapper').addClass('col-12');//ensure the datatable fills the full width (site-to-site only)
        $('.remote-access table').DataTable({ paging: false });//will sort by LCSO ID # by default
        $('.remote-access .dataTables_wrapper').addClass('col-8');//ensure the datatable fills the half of full width (remote-access only)

    }

    return networkStatus;//return what we built
}
/****************************************************************************NETWORKSTATUS: Factory Function*****/