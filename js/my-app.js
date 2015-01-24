// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    domCache: true //enable inline pages
});

// Load about page:
//mainView.router.load({pageName: 'about'});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('itemDetails', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('Home', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

/*
======================================================
***********       peerJS Functions        ************
======================================================
*/

/*navigator.getUserMedia({video: true, audio: false}, function(stream) {
  var call = peer.call('another-peers-id', stream);
  call.on('stream', function(remoteStream) {
    // Show stream in some <video> element.
  });
}, function(err) {
  console.log('Failed to get local stream' ,err);
});*/

var remoteWebRtcKey = 'ocfcqaz1in72p23';
var peer = new Peer('wee5', { key: '1bti5w4jdcej0pb9', debug: 3, config: {'iceServers': [
      { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
    ]}});
    



function requestVideo() {

  navigator.getUserMedia({video: true, audio: true},
                       getUserMediaOkCallback,
                       getUserMediaFailedCallback);
}

function getUserMediaFailedCallback(error) {
  myApp.alert("User media request denied with error code " + error.code);
}

function getUserMediaOkCallback(stream) {
  // Call the polyfill wrapper to attach the media stream to this element.
  //attachMediaStream(document.getElementById("video_chat"), stream);

  var call = peer.call(remoteWebRtcKey, stream);

  call.on('stream', function(remoteStream) {
    // `stream` is the MediaStream of the remote peer.
    // Here you'd add it to an HTML video/canvas element.
    //$$('#video_chat').prop('src', URL.createObjectURL(remoteStream));
    $$('#video_chat').show();
    attachMediaStream(document.getElementById("video_chat"), remoteStream);
    //$$('#video_chat').prop('src', URL.createObjectURL(remoteStream));
  });

  $$('#video_chat').click(function() {
    this.toggle();
  });

  peer.on('call', function(call) {
    // Answer the call, providing our mediaStream
    call.answer(stream);
  });
}




/*
======================================================
***********      JSONP to venicePeach     ************
======================================================
*/
var results = [];
var keyword;
$$('#main_content').html('');

keyword = 'blazer';
var keywordSearch = function(keyword) {
    var url = 'http://venicepeach.com/hack/sears/test.php?keyword=' + keyword + '&callback=?';
    //login request
    $$.ajax({
        async: false,
        url: url,
        crossDomain: true,
        timeout: 5000, //10 sec timeout for ajax
        success: function(response) {
            var temp = JSON.parse(response);
            temp.SearchResults.keyword = keyword;
            results.push(temp);
        }
    });
};

var process = function() {

  //console.log(results);
  _.each(results, function(it) {
    _.each(it.SearchResults.Products, function(item) {
        item.dollars = item.Price.DisplayPrice.split('.')[0] || '';
        item.cents   = item.Price.DisplayPrice.split('.')[1] || '';
    });

    var previewCategoryObject = it.SearchResults;
    previewCategoryObject.Products = it.SearchResults.Products.slice(0,5);

    var previewSliderHtml = Template7.templates.itemPreviewTemplate(previewCategoryObject);
    console.log(previewCategoryObject);
    $$('#main_content').append(previewSliderHtml);
    // Init slider and store its instance in mySlider variable
    var selectorString = '.slider-container.' + it.SearchResults.keyword;
    myApp.slider(selectorString, {
      pagination:'.slider-pagination',
      spaceBetween: 20,
      slidesPerView: 1.2,
      speed: 250,
      loop: true
    });

  });
  //$$('#main_content').append(previewSliderHtml);
  //itemListHtml = Template7.templates.itemListTemplate(results.SearchResults);


  

  //$$('#main_content').append(itemListHtml);

  requestVideo();
};

keyword = 'blazer';
keywordSearch(keyword);
keyword = 'appliances';
keywordSearch(keyword);
keyword = 'lawn';
keywordSearch(keyword);
keyword = 'washer';
keywordSearch(keyword);
keyword = 'wrench';
keywordSearch(keyword);

process();
