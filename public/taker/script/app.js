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

myApp.onPageInit('package-2', function(page) {
    $$(page.container).find('#take-package').on('click', function(e) {
        myApp.confirm('Are you sure to take?', 'Take Confirmation', function() {
            mainView.router.loadPage('package2.taken.html');
            socket.emit('taker', {taken: true, name: 'Martin Mueller'})
        })
    });
});

myApp.onPageInit('package-2-taken', function(page) {
    $$(page.container).find('#arr-home').on('click', function(e) {
        socket.emit('taker', {home: true, name: 'Martin Mueller'});
        $$(page.container).find('#arr-home').hide();
    });
    $$(page.container).find('#hand-over').on('click', function(e) {
        socket.emit('taker', {hand: true, before: 'Martin Mueller', after: 'Claudia'});
        $$(page.container).find('#hand-over').hide();
    });
});

socket.on('taker', function(data) {
  if(data.home)
    myApp.addNotification({
            title: 'Relay Logistic',
            message: data.name + ' is going to take the package.'
        });
  else if(data.relay)
    myApp.addNotification({
            title: 'Relay Logistic',
            message: data.name + ' asked you to go on relay. Please wait for other taker.',
            onClose: function () {
              setTimeout(function () {
                myApp.addNotification({
                    title: 'Relay Logistic',
                    message: 'Claudia is going to take the package.'
                });
              }, 2000)
            }
        });
})
