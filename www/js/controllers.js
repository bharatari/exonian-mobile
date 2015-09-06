angular.module('ExonianMobile.controllers', ['ionic'])

.controller('AppController', function($scope, MenuFactory) {
    $scope.MenuFactory = MenuFactory;
    ionic.Platform.fullScreen();
})

.controller('HeadlinesController', function($scope, PostsFactory, $ionicLoading, $state, UtilityFactory, $ionicPopup, $window) {
    $scope.error = false;
    $ionicLoading.show({
        template: "Loading"
    });
    $scope.Page = 1;
    PostsFactory.getRecentPosts().success(function(response) {
        $scope.Posts = UtilityFactory.processAuthors(response.posts);
        $scope.MaxPage = response.pages;
        $ionicLoading.hide();
    }).error(function(err) {
        $ionicLoading.hide();
        $scope.error = true;
    });
    PostsFactory.getFeaturedPost().success(function(response) {
        $scope.Featured = response.posts[0];
        $scope.FeaturedTitle = $scope.Featured.title;
        if($scope.FeaturedTitle.length > 40) {
            $scope.FeaturedTitle = $scope.FeaturedTitle.substring(0, 40);
            $scope.FeaturedTitle += "...";
        }
        if($scope.Featured.attachments[0].url) {
            $('.nav-bar-large').css('background-image', 'url(' +       $scope.Featured.attachments[0].url + ')');            
        }
    });
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
    $scope.loadMore = function() {
        $scope.Page += 1;
        PostsFactory.getRecentPage($scope.Page).success(function(response) {
            var posts = UtilityFactory.processAuthors(response.posts);
            for(var i = 0; i < posts.length; i++) {
                if($scope.Posts) {
                    $scope.Posts.push(posts[i]);
                }
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.refresh = function() {
        $scope.error = false;
        $scope.Page = 1;
        PostsFactory.getRecentPosts().success(function(response) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.Posts = UtilityFactory.processAuthors(response.posts);
            $scope.MaxPage = response.pages;
        }).error(function(err) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.error = true;
        });
        PostsFactory.getFeaturedPost().success(function(response) {
            $scope.Featured = response.posts[0];
            $scope.FeaturedTitle = $scope.Featured.title;
            if($scope.FeaturedTitle.length > 40) {
                $scope.FeaturedTitle = $scope.FeaturedTitle.substring(0, 40);
                $scope.FeaturedTitle += "...";
            }
            if($scope.Featured.attachments[0].url) {
                $('.nav-bar-large').css('background-image', 'url(' +       $scope.Featured.attachments[0].url + ')');            
            }
        });
    }
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
    $scope.error = false;
    $scope.Page = 1;
    PostsFactory.getCategory($stateParams.categoryName).success(function(response) {
        $scope.Posts = UtilityFactory.processAuthors(response.posts);
        $scope.MaxPage = response.pages;
        $scope.Title = UtilityFactory.findCategory($stateParams.categoryName);
    });
    $scope.checkData = function() {
        var pages = $scope.Page + 1;
        if(pages > $scope.MaxPage) {
            return false;
        }
        else {
            return true;
        }
    }
    $scope.loadMore = function() {
        $scope.Page += 1;
        PostsFactory.getCategoryPage($stateParams.categoryName, $scope.Page).success(function(response) {
            var posts = UtilityFactory.processAuthors(response.posts);
            for(var i = 0; i < posts.length; i++) {
                if($scope.Posts) {
                    $scope.Posts.push(posts[i]);
                }
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.refresh = function() {
        $scope.error = false;
        $scope.Page = 1;
        PostsFactory.getCategory($stateParams.categoryName).success(function(response) {
            $scope.Posts = UtilityFactory.processAuthors(response.posts);
            $scope.MaxPage = response.pages;
            $scope.Title = UtilityFactory.findCategory($stateParams.categoryName);
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.error = true;
        });
    }
})

.controller('ArticleController', function($scope, PostsFactory, $ionicLoading, $stateParams) {
    $ionicLoading.show({
        template: "Loading"
    });
    PostsFactory.getPost($stateParams.articleId).success(function(response){
        $scope.Post = response.post;
        if($scope.Post.custom_fields.authors[0]) {
            if($scope.Post.custom_fields.authors[0] === "") {
                $scope.Author = $scope.Post.author.name;
            }
            else {
                $scope.Author = $scope.Post.custom_fields.authors[0];
            }
        }
        else {
            $scope.Author = $scope.Post.author.name;
        }
        if($scope.Post.attachments.length > 0) {
            $scope.Image = $scope.Post.attachments[0].url;
            $scope.ImageString = "background-image: url(" + $scope.Image + "); ";
            var img = new Image();
            img.addEventListener("load", function() {
                if(img.width > img.height) {
                    $('.article-image').addClass('article-image-wide');
                }
            }, false);
            img.src = $scope.Image;
        }
        $ionicLoading.hide();
    });
});