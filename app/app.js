define( [
    'angular',
    'ionic'
] , function ( angular ) {
    return angular.module( 'application' , ['ionic', 'tabSlideBox'] )
        .config( [
            '$stateProvider' ,
            '$ionicConfigProvider' ,
            '$provide',
            '$httpProvider',
            function ($stateProvider, $ionicConfigProvider, $provide, $httpProvider) {
                // Intercept http calls.
                  $provide.factory('MyHttpInterceptor', ['$q', '$location', function ($q, $location) {
                    return {
                      // On request success
                      request: function (config) {
                        config.headers = config.headers || {};
                        config.headers['token'] = window.sessionStorage.getItem('simplysweet_token');
                        // console.log(config); // Contains the data about the request before it is sent.

                        // Return the config or wrap it in a promise if blank.
                        return config || $q.when(config);
                      },

                      // On request failure
                      requestError: function (rejection) {
                        // console.log(rejection); // Contains the data about the error on the request.
                        
                        // Return the promise rejection.
                        return $q.reject(rejection);
                      },

                      // On response success
                      response: function (response) {
                        // console.log(response); // Contains the data from the response.
                        
                        // Return the response or promise.
                        return response || $q.when(response);
                      },

                      // On response failture
                      responseError: function (rejection) {
                        //console.log(rejection); // Contains the data about the error.
                        if(401 === rejection.status) {
                            // token失效到登陸頁面
                            // $location.path('/signin');
                        }
                        
                        // Return the promise rejection.
                        return $q.reject(rejection);
                      }
                    };
                  }]);

                  // Add the interceptor to the $httpProvider.
                $httpProvider.interceptors.push('MyHttpInterceptor');
                $ionicConfigProvider.navBar.alignTitle('center');
                $ionicConfigProvider.backButton.text('返回');
                $ionicConfigProvider.platform.android.tabs.style('standard');
                $ionicConfigProvider.platform.android.tabs.position('bottom');

                // 设置路由
                $stateProvider.state( 'tab' , {
                    url : '/tab' ,
                    abstract: true,
                    templateUrl : 'modules/tab/tabs.html',
                    prefetchTemplate: false,
                    controller : 'TabsController' ,
                    resolve : {
                        load : loadDeps( [
                            'modules/tab/tabs'
                        ] )
                    }
                } )
                .state( 'tab.home' , {
                    url : '/home' ,
                    views: {
                      'home-tab': {
                        templateUrl : 'modules/home/home.html',
                        prefetchTemplate: false,
                        controller : 'HomeController' ,
                        resolve : {
                            load : loadDeps( [
                                'modules/home/home'
                            ] )
                        }
                      }
                    }
                } )
                .state( 'tab.top-list' , {
                    url : '/top-list' ,
                    views: {
                      'top-list-tab': {
                        templateUrl : 'modules/top-list/top-list.html',
                        prefetchTemplate: false,
                        controller : 'TopListCtrl' ,
                        resolve : {
                            load : loadDeps( [
                                'modules/top-list/top-list'
                            ] )
                        }
                      }
                    }
                } )
                .state( 'tab.topic' , {
                    url : '/topic' ,
                    views: {
                      'topic-tab': {
                        templateUrl : 'modules/topic/topic.html',
                        prefetchTemplate: false,
                        controller : 'TopicCtrl' ,
                        resolve : {
                            load : loadDeps( [
                                'modules/topic/topic'
                            ] )
                        }
                      }
                    }
                } )
                .state( 'tab.mine' , {
                    url : '/mine' ,
                    views: {
                      'mine-tab': {
                        templateUrl : 'modules/mine/mine.html',
                        prefetchTemplate: false,
                        controller : 'MineCtrl' ,
                        resolve : {
                            load : loadDeps( [
                                'modules/mine/mine'
                            ] )
                        }
                      }
                    }
                } );

                
                // 这段代码必须放在最后一个路由，否则直接在链接中到 #/路由 会无效
                $stateProvider.state( 'otherwise' , {
                    url : '*path' ,
                    template : '' ,
                    controller : [
                        '$state' ,
                        function ( $state ) {
                            $state.go( 'tab.home' );
                        }
                    ]
                } );

                /**
                 * 加载依赖的辅助函数
                 * @param deps
                 * @returns {*[]}
                 */
                function loadDeps( deps ) {
                    return [
                        '$q' , function ( $q ) {
                            var def = $q.defer();
                            require( deps , function () {
                                def.resolve();
                            } );
                            return def.promise;
                        }
                    ];
                }

            }
        ] );
} );

