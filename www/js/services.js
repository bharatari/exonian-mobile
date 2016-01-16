angular.module('ExonianMobile.services', [])

.factory('MenuFactory', function() {
    return [
        { id:'news', name:'News' },
        { id:'exeter-life', name:'Life' },
        { id:'opinion', name:'Opinion' },
        { id:'humor', name:'Humor' },
        { id:'sports', name:'Sports' }
    ];
})

.factory('PostsFactory', function($http) {
    return {
        getRecentPosts: function() {
            return $http.get('http://www.theexonian.com/?json=get_recent_posts');
        },
        getRecentPage: function(page) {
            return $http.get('http://www.theexonian.com/?json=get_recent_posts&page=' + page);
        },
        getFeaturedPost: function() {
            return $http.get('http://www.theexonian.com/api/core/get_category_posts/?category_slug=featured');
        },
        getPost: function(id) {
            return $http.get('http://www.theexonian.com/api/core/get_post/?id=' + id);
        },
        getCategory: function(categoryName) {
            return $http.get('http://www.theexonian.com/api/core/get_category_posts/?category_slug=' + categoryName);
        },
        getCategoryPage: function(categoryName, page) {
            return $http.get('http://www.theexonian.com/api/core/get_category_posts/?category_slug=' + categoryName + "&page=" + page);
        }
    }
})

.factory('SearchFactory', function($http) {
    return {
        searchPosts: function(searchTerm) {
            return $http.get('http://www.theexonian.com/api/core/get_search_results/?search=' + searchTerm);
        },
        searchPostsPage: function(searchTerm, page) {
            return $http.get('http://www.theexonian.com/api/core/get_search_results/?search=' + searchTerm + "&page=" + page);
        }
    }
})

.factory('UtilityFactory', function(MenuFactory) {
    return {
        stringifyArray: function(array) {
            var string = "";
            for (var i = 0; i < array.length; i++) {
                if (i === 0) {
                    string += array[i];
                } else {
                    string += ", " + array[i];
                }
            }
        },
        processAuthors: function(posts) {
            if (posts) {
              for (var i = 0; i < posts.length; i++) {
                if (posts[i]) {
                  if (posts[i].title.length > 45) {
                    posts[i].titleClip = posts[i].title.substring(0, 45);
                    posts[i].titleClip += "...";
                  } else {
                      posts[i].titleClip = posts[i].title;
                  }
                }
                if (posts[i].custom_fields) {
                  if (posts[i].custom_fields.authors) {
                    if (posts[i].custom_fields.authors[0]) {
                      if (posts[i].custom_fields.authors[0] === "") {
                          posts[i].Author = posts[i].author.name;
                      }
                      else {
                          posts[i].Author = posts[i].custom_fields.authors[0];
                      }
                    }
                    else {
                        posts[i].Author = posts[i].author.name;
                    }
                  }
                }                
              }
            }            
            return posts;
        },
        findCategory: function(categoryName) {
            var menu = MenuFactory;
            for (var i = 0; i < menu.length; i++) {
                if (categoryName === menu[i].id) {
                    return menu[i].name;
                }
            }
        }
    }
});