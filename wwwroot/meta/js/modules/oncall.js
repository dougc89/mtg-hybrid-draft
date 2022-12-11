//On Call Calendar (dependecy = meta.js)
function ONCALL() {
    var ui = {};//we will build this
    ui.qstring = QSTRING();// dependency on QSTRING object


    ui.initialize = function () {
        enableTreeview();// dependency: meta.js

        // open page state as defined in querystring
        ui.qstring.read(); 
        ui.openTree();
        // give the tree time to open before we try to scroll to a location (slide animation duration: 400ms)
        setTimeout(function () {
            ui.scrollTo();
        }, 500)


        // // event listeners:

        // contacts page
        $('.dept-toggle').click(function () {
            var dept_id = $(this).attr('id').substring(1); // skips over the 'd' prefix on these element id's
            // give the treeview time to set the state on the toggle ['open','closed']
            setTimeout(function (el, dept_id) {
                if (el.hasClass('open')) {
                    ui.setDept(dept_id);
                } else {
                    ui.removeDept(dept_id);
                }
            }, 100, $(this), dept_id);

        });
        
    }//end: initialize

    // // helper functions
    ui.openTree = function () {
        const self = ui;
        // check that the required property is set
        try {
            if (self.qstring.values && self.qstring.values.d) {
                
                var depts = self.qstring.values.d;
                // should be an array of values
                if (depts.length == 0) throw 'nothing set to open';
                depts.forEach(val => {
                    // prepends element id prefix, then automatically trigger click event
                    var el = $('#d' + val);
                    if (el.length == 0) throw 'nothing found to scroll to';
                    el.click();
                });

            } else {
                throw 'nothing set to open';
            }
        } catch (err) {
            // console.log(err);
        }
        return self;
    }

    ui.scrollTo = function () {
        const self = ui;
        // check that the required property is set
        try {
            if (self.qstring.values && self.qstring.values.s) {
                // prepends element id prefix, then locates the DOM element associated
                var el = $('#d' + self.qstring.values.s);
                if (el.length == 0) throw 'nothing found to scroll to'; 
                el = el[0]; // grab DOM element out of jQuery obj
                // console.log(el);
                el.scrollIntoView(true);
            } else {
                throw 'nothing set to scroll to'; 
            }
        }catch(err) {
           //  console.log(err);
        }
        return self;
    }

    ui.setDept = function (dept_id) {
        // get current querystring state
        var values = ui.qstring.read().values;
        // if (!values) values = {};

        // set the scroll property:
        values.s = dept_id;

        // add the dept to values.d (dept list) 
        if (!values.d) {
            // if nothing there yet
            values.d = [dept_id];
        } else if (values.d.indexOf(dept_id) < 0) {
            // append if not already in the list
            values.d.push(dept_id);
        }

        // write this new set of values to the querystring
        ui.qstring.write();
    }

    ui.removeDept = function (dept_id) {
        // get current querystring state
        var values = ui.qstring.read().values;

        // remove the scroll property:
        delete values.s;

        // remove the dept from values.d (dept list) if it is there
        if (values.d && values.d.indexOf(dept_id) > -1) {
            var index = values.d.indexOf(dept_id);
            values.d.splice(index, 1);
        }

        // write this new set of values to the querystring
        ui.qstring.write();
    }
    return ui;//return what we built
}