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

function requestVideo() {
  navigator.getUserMedia({video: true, audio: false},
                       getUserMediaOkCallback,
                       getUserMediaFailedCallback);
}

function getUserMediaFailedCallback(error) {
  myApp.alert("User media request denied with error code " + error.code);
}

function getUserMediaOkCallback(stream) {
  // Call the polyfill wrapper to attach the media stream to this element.
  attachMediaStream(document.getElementById("my_webcam"), stream);
}



/*
======================================================
***********      JSONP to venicePeach     ************
======================================================
*/
var results = {};

var keywordSearch = function(keyword) {
    var url = 'http://venicepeach.com/hack/sears/test.php?keyword=' + keyword + '&callback=?';
    //login request
    $$.ajax({
        async: true,
        url: url,
        crossDomain: true,
        timeout: 5000, //10 sec timeout for ajax
        success: function(response) {
            results = JSON.parse(response);
            results.keyword = keyword;
            process();
        }
    });
};

keywordSearch('blazer');

var process = function() {
  var itemListHtml = '';
  var previewSliderHtml = '';
  console.log(results);
  _.each(results.SearchResults.Products, function(item){
      item.dollars = item.Price.DisplayPrice.split('.')[0] || '';
      item.cents   = item.Price.DisplayPrice.split('.')[1] || '';

      /*var tempObj = {
        partNumber: (item.Id.PartNumber || false),
        catEntryId: (item.Id.CatEntryId || false),
        mfgPartNumber: (item.Id.MfgPartNumber || false),
        name: (item.Description.Name || false),
        brandName: (item.Description.BrandName || false),
        imageURL: (item.Description.ImageURL || false),
        displayPrice: (item.Price.DisplayPrice || false),
        dollars: (dollars || false),
        cents: (cents || false),
        source: (item.Availability.Source || false)
      };*/
  });
  itemListHtml = Template7.templates.itemListTemplate(results.SearchResults);


  _.each(results.SearchResults.Products.slice(0,5), function(item) {
      console.log(item);
      item.dollars = item.Price.DisplayPrice.split('.')[0] || '';
      item.cents   = item.Price.DisplayPrice.split('.')[1] || '';

      /*var tempObj = {
        partNumber: (item.Id.PartNumber || false),
        catEntryId: (item.Id.CatEntryId || false),
        mfgPartNumber: (item.Id.MfgPartNumber || false),
        name: (item.Description.Name || false),
        brandName: (item.Description.BrandName || false),
        imageURL: (item.Description.ImageURL || false),
        displayPrice: (item.Price.DisplayPrice || false),
        dollars: (dollars || false),
        cents: (cents || false),
        source: (item.Availability.Source || false)
      };*/
  });
  previewSliderHtml = Template7.templates.itemPreviewTemplate(tempObj);

  $$('#preview_container').html(previewSliderHtml);
  // Init slider and store its instance in mySlider variable
    var mySlider = myApp.slider('.slider-container', {
      pagination:'.slider-pagination',
      spaceBetween: 20,
      slidesPerView: 1.2,
      loop: true
    });



  $$('#list_container').html(itemListHtml);

  requestVideo();
};