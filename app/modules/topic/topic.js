define( [
    '../../app'
] , function ( controllers ) {
    controllers.controller( 'TopicCtrl' , [
            '$scope' ,
            'config',
            function ($scope, config) {
                console.log(config.api);
            }
        ] );
} );