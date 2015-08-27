// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ExonianMobile', ['ionic', 'ExonianMobile.controllers', 'ExonianMobile.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  if(ionic.Platform.isAndroid()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }   
    
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppController'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SearchController'
      }
    }
  })

  .state('app.headlines', {
    url: "/headlines",
    views: {
      'menuContent': {
        templateUrl: "templates/headlines.html",
        controller: 'HeadlinesController'
      }
    }
  })
    
  .state('app.category', {
      url: "/category/:categoryName",
      views: {
        'menuContent': {
          templateUrl: "templates/category.html",
          controller: 'CategoryController'
        }
      }
    })

  .state('app.article', {
    url: "/article/:articleId",
    views: {
      'menuContent': {
        templateUrl: "templates/article.html",
        controller: 'ArticleController'
      }
    }
  })
   
  .state('app.about', {
    url:"/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }  
  })

  $urlRouterProvider.otherwise('/app/headlines');
});
