// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var db = null;
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        dbcopy();
    };

    function dbcopy() {
        window.plugins.sqlDB.copy("sale.db", 0, copysuccess, copyerror);
    }

    function removeDB() {
        var location = 1;
        window.plugins.sqlDB.remove("sale.db", location, rmsuccess, rmerror);
    }

    function copysuccess() {
        db = window.sqlitePlugin.openDatabase({ name: 'sale.db', location: 'default' });
    }

    function copyerror(e) {
        //db already exists or problem in copying the db file. Check the Log.
        console.log("Error Code = " + JSON.stringify(e));
        //e.code = 516 => if db exists
        if (e.code === 516) {
            db = window.sqlitePlugin.openDatabase({ name: 'sale.db', location: 'default' });
        }
    }

    $('#insert').click(function () {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO sale(name,family) VALUES (?,?)', [$('#name').val(), $('#family').val()]);
        }, function (error) {
            console.log('Transaction ERROR: ' + error.message);
        }, function () {
            console.log('Populated database OK');
        });
    });

    $('#select').click(function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT  * FROM users', [], function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    var value = "<li data-role=\"list-divider\">" +
                        results.rows.item(i).family +
                        "<span class=\"ui-li-count\">" +
                        results.rows.item(i).family +"</span></li>\r\n" +
                        "    <li><a href=\"index.html\">\r\n    <h2>Stephen Weber</h2>\r\n    <p><strong>You've been invited to a meeting at Filament Group in Boston, MA</strong></p>\r\n    <p>Hey Stephen, if you're available at 10am tomorrow, we've got a meeting with the jQuery team.</p>\r\n        <p class=\"ui-li-aside\"><strong>6:24</strong>PM</p>\r\n    </a></li>";
                    $("#TableData").append("<tr><td>" + results.rows.item(i).name + "</td><td>" + results.rows.item(i).family + "</td></tr>");
                }

            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        });
    });


    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();


