define( [
    'angular',
    'ionic'
] , function ( angular ) {
    return angular.module( 'application' , ['ionic', 'tabSlideBox'] )
        .config( [
            '$stateProvider' ,
            '$ionicConfigProvider' ,
            function ($stateProvider, $ionicConfigProvider) {
                $ionicConfigProvider.platform.android.tabs.style('standard');
                $ionicConfigProvider.platform.android.tabs.position('bottom');

                // 设置路由
                $stateProvider.state( 'tab' , {
                    url : '/tab' ,
                    abstract: true,
                    templateUrl : 'modules/tab/tabs.html',
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

