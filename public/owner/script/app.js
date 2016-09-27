// Initialize app and store it to myApp variable for futher access to its methods
var myApp = new Framework7();

// Initialize Socket.io
var socket = io.connect('/');

// We need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('#main-view', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var packView = myApp.addView('#package-view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
  // Do something here for "about" page
  myApp.alert('Here comes About page');
});

myApp.onPageInit('package-2-delivered', function (page) {
    $$(page.container).find('#go-to-take').on('click', function(e) {
        socket.emit('owner', {home: true, name: 'Olivia'});
    });
    $$(page.container).find('#wait-for').on('click', function(e) {
        socket.emit('owner', {relay: true, name: 'Olivia'});
    });
})

socket.on('owner', function(data) {
    if(data.taken)
        myApp.addNotification({
            title: 'Relay Logistic',
            message: 'Your package was taken by ' + data.name,
            onClose: function () {
                mainView.router.loadPage('package2.html');
            }
        });
    else if(data.home)
        myApp.addNotification({
            title: 'Relay Logistic',
            message: 'Your package was located at ' + data.name + '\'s home.',
            onClose: function () {
                mainView.router.loadPage('package2.delivered.html');
            }
        });
    else if(data.hand)
        myApp.addNotification({
            title: 'Relay Logistic',
            message: data.before + ' gives your package to ' + data.after,
            onClose: function () {
                mainView.router.loadPage('package2.claudia.html');
            }
        });
})
