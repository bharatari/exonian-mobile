angular.module('ExonianMobile.services', [])

.factory('MenuFactory', function () {
  return [
    { id: 'news', name: 'News' },
    { id: 'exeter-life', name: 'Life' },
    { id: 'opinion', name: 'Opinion' },
    { id: 'humor', name: 'Humor' },
    { id: 'sports', name: 'Sports' }
  ];
})

.factory('PostsFactory', function ($http, UtilityFactory) {
  return {
    getRecentPosts: function () {
      return $http.get('http://www.theexonian.com/?json=get_recent_posts');
    },
    getRecentPage: function (page) {
      return $http.get('http://www.theexonian.com/?json=get_recent_posts&page=' + page);
    },
    getFeaturedPost: function () {
      return $http.get('http://www.theexonian.com/api/core/get_category_posts/?category_slug=featured');
    },
    getPost: function (id) {
      return $http.get('http://www.theexonian.com/api/core/get_post/?id=' + id);
    },
    getCategory: function (categoryName) {
      return $http.get('http://www.theexonian.com/api/core/get_category_posts/?category_slug=' + categoryName);
    },
    getCategoryPage: function (categoryName, page) {
      return $http.get('http://www.theexonian.com/api/core/get_category_posts/?category_slug=' + categoryName + "&page=" + page);
    }
  }
})

.factory('SearchFactory', function ($http) {
  return {
    searchPosts: function (searchTerm) {
      return $http.get('http://www.theexonian.com/api/core/get_search_results/?search=' + searchTerm);
    },
    searchPostsPage: function (searchTerm, page) {
      return $http.get('http://www.theexonian.com/api/core/get_search_results/?search=' + searchTerm + "&page=" + page);
    }
  }
})

.factory('UtilityFactory', function (MenuFactory) {
  return {
    stringifyArray: function (array) {
      var string = "";
      for (var i = 0; i < array.length; i++) {
        if (i === 0) {
          string += array[i];
        } else {
          string += ", " + array[i];
        }
      }
    },
    processAuthors: function (posts) {
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
                } else {
                  posts[i].Author = posts[i].custom_fields.authors[0];
                }
              } else {
                posts[i].Author = posts[i].author.name;
              }
            }
          }
        }
      }
      return posts;
    },
    findCategory: function (categoryName) {
      var menu = MenuFactory;
      for (var i = 0; i < menu.length; i++) {
        if (categoryName === menu[i].id) {
          return menu[i].name;
        }
      }
    },
    processFeatured: function (response) {
      if (response) {
        if (response.posts) {
          if (response.posts[0]) {
            return this.processFeaturedTitle(response.posts[0]);
          }
        }
      }
      return {};
    },
    processFeaturedTitle: function (post) {
      if (post) {
        if (post.title) {
          if (post.title.length > 40) {
            post.title = post.title.substring(0, 40);
            post.title += "...";
          }
        }
      }
      return post;
    },
    getFeaturedImage: function (post) {
      if (post) {
        if (post.attachments) {
          if (post.attachments[0]) {
            return post.attachments[0].url;
          }
        }
      }
      return "";
    },
    processArticle: function (post) {
      if (post) {
        post.ExonianMobile = {
          Author: "",
          Image: "",
          BackgroundImage: ""
        };
        if (post.custom_fields) {
          if (post.custom_fields.authors) {
            if (post.custom_fields.authors[0]) {
              if (post.custom_fields.authors[0] === "") {
                post.ExonianMobile.Author = post.author.name;
              } else {
                post.ExonianMobile.Author = post.custom_fields.authors[0];
              }
            }
            else {
              post.ExonianMobile.Author = post.author.name;
            }
          }
        }
        if (post.attachments) {
          if (post.attachments.length > 0) {
            post.ExonianMobile.Image = post.attachments[0].url;
            post.ExonianMobile.BackgroundImage = "background-image: url(" + post.ExonianMobile.Image + "); ";
          }
        }
      } else {
        post = {
          ExonianMobile: {
            Author: "",
            Image: "",
            BackgroundImage: ""
          }
        };
      }
      return post;
    }
  }
});
