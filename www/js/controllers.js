angular.module('ExonianMobile.controllers', ['ionic'])

.controller('AppController', function($scope, MenuFactory) {
    $scope.MenuFactory = MenuFactory;
})

.controller('HeadlinesController', function($scope, PostsFactory, $ionicLoading, $state, UtilityFactory, $ionicPopup, $window) {
    $scope.reset = function() {
        $scope.Page = 1;
        $scope.error = false;
    }
    $scope.setup = function() {
        $scope.reset();
        $scope.loadHeadline();
        $scope.loadRecentPosts();
    }
    $scope.loadHeadline = function() {
        PostsFactory.getFeaturedPost().success(function(response) {
            $scope.Featured = UtilityFactory.processFeatured(response);
            $scope.FeaturedImage = UtilityFactory.getFeaturedImage($scope.Featured);
            var img = new Image();
            img.addEventListener("load", function() {
              $('.nav-bar-large').attr("style", "background-image:url(" + $scope.FeaturedImage + ");");
            }, false);
            img.src = $scope.FeaturedImage;
        }).error(function(err) {
            $scope.error = true;
        });
    }
    $scope.loadRecentPosts = function() {
        PostsFactory.getRecentPosts().success(function(response) {
            $scope.Posts = UtilityFactory.processAuthors(response.posts);
            $scope.MaxPage = response.pages;
        }).error(function(err) {
            $scope.error = true;
        });
    }
    $scope.goToHeadline = function(headline) {
        $state.go('app.article', { articleId:headline.id });
    }
    $scope.checkData = function() {
        var pages = $scope.Page + 1;
        if(pages > $scope.MaxPage) {
            return false;
        }
        else {
            return true;
        }
    }
    $scope.addToPosts = function(posts) {
        for(var i = 0; i < posts.length; i++) {
            if($scope.Posts) {
                $scope.Posts.push(posts[i]);
            }
        }
    }
    $scope.loadMore = function() {
        $scope.Page += 1;
        PostsFactory.getRecentPage($scope.Page).success(function(response) {
            var posts = UtilityFactory.processAuthors(response.posts);
            $scope.addToPosts(posts);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.refresh = function() {
        $scope.reset();
        $scope.loadRecentPosts();
        $scope.loadHeadline();
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.setup();
})

.controller('SearchController', function($scope, $ionicLoading, SearchFactory) {
    $scope.search = function(searchTerm) {
        $ionicLoading.show({
            template: "Loading"
        });
        $scope.Page = 1;
        SearchFactory.searchPosts(searchTerm).success(function(response) {
            $scope.Posts = response.posts;
            $scope.CurrentTerm = searchTerm;
            $scope.MaxPage = response.pages;
            $ionicLoading.hide();
        });
    }
    $scope.checkData = function() {
        var pages = $scope.Page + 1;
        if($scope.MaxPage) {
            if(pages > $scope.MaxPage) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    $scope.loadMore = function() {
        $scope.Page += 1;
        SearchFactory.searchPostsPage($scope.CurrentTerm, $scope.Page).success(function(response) {
            var posts = response.posts;
            for(var i = 0; i < posts.length; i++) {
                if($scope.Posts) {
                    $scope.Posts.push(posts[i]);
                }
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
})

.controller('CategoryController', function($scope, PostsFactory, UtilityFactory, $ionicLoading, $stateParams) {
    $scope.reset = function() {
        $scope.error = false;
        $scope.Page = 1;
    }
    $scope.getCategory = function(categoryName, refresh) {
        PostsFactory.getCategory(categoryName).success(function(response) {
            $scope.Posts = UtilityFactory.processAuthors(response.posts);
            $scope.MaxPage = response.pages;
            $scope.Title = UtilityFactory.findCategory(categoryName);
            if (refresh) {
                $scope.$broadcast('scroll.refreshComplete');
            }
        }).error(function(err) {
            if (refresh) {
                $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.error = true;
        });
    }
    $scope.checkData = function() {
        var pages = $scope.Page + 1;
        if(pages > $scope.MaxPage) {
            return false;
        }
        else {
            return true;
        }
    }
    $scope.addToPosts = function(posts) {
        for(var i = 0; i < posts.length; i++) {
            if($scope.Posts) {
                $scope.Posts.push(posts[i]);
            }
        }
    }
    $scope.loadMore = function() {
        $scope.Page += 1;
        PostsFactory.getCategoryPage($stateParams.categoryName, $scope.Page).success(function(response) {
            var posts = UtilityFactory.processAuthors(response.posts);
            $scope.addToPosts(posts);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.refresh = function() {
        $scope.error = false;
        $scope.Page = 1;
        $scope.getCategory($stateParams.categoryName, true);
    }
    $scope.reset();
    $scope.getCategory($stateParams.categoryName);
})

.controller('ArticleController', function($scope, PostsFactory, $ionicLoading, $stateParams, UtilityFactory) {
    $ionicLoading.show({
        template: "Loading"
    });
    $scope.loadImage = function(imageUrl) {
        var img = new Image();
        img.addEventListener("load", function() {
            if(img.width > img.height) {
                $('.article-image').addClass('article-image-wide');
            }
        }, false);
        img.src = imageUrl;
    }
    $scope.loadPost = function(articleId) {
        PostsFactory.getPost(articleId).success(function(response) {
          $scope.Post = UtilityFactory.processArticle(response.post);
          $scope.Image = $scope.Post.ExonianMobile.Image;
          console.log($scope.Image);
          $scope.BackgroundImage = $scope.Post.ExonianMobile.BackgroundImage;
          $scope.loadImage($scope.Image);
          $ionicLoading.hide();
      });
    }
    $scope.loadPost($stateParams.articleId);
});