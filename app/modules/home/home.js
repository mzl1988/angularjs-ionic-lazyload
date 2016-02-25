define( [
    '../../app'
] , function ( controllers ) {
    controllers.controller( 'HomeController' , [
            '$scope' ,
            '$ionicModal',
            function ($scope, $ionicModal) {
                console.log('測試home');
                $scope.ionScrollHeight = angular.element('ion-tabs').height() - 91;
                $scope.onSlideMove = function(data){
                  //alert("You have selected " + data.index + " tab");
                };
                $scope.channels = [
                  {"text" : "推薦", "template" : "modules/home/recommend.html"},
                  {"text" : "熱點", "template" : "modules/home/recommend.html"},
                  {"text" : "社會", "template" : "modules/home/recommend.html"},
                  {"text" : "娛樂", "template" : "modules/home/recommend.html"},
                  {"text" : "科技", "template" : "modules/home/recommend.html"},
                  {"text" : "財經", "template" : "modules/home/recommend.html"},
                  {"text" : "國際", "template" : "modules/home/recommend.html"},
                  {"text" : "時尚", "template" : "modules/home/recommend.html"},
                  {"text" : "軍事", "template" : "modules/home/recommend.html"},
                  {"text" : "遊戲", "template" : "modules/home/recommend.html"},
                  {"text" : "美文", "template" : "modules/home/recommend.html"},
                  {"text" : "美食", "template" : "modules/home/recommend.html"},
                  {"text" : "電影", "template" : "modules/home/recommend.html"},
                  {"text" : "養生", "template" : "modules/home/recommend.html"},
                  {"text" : "育兒", "template" : "modules/home/recommend.html"},
                  {"text" : "歷史", "template" : "modules/home/recommend.html"},
                  {"text" : "故事", "template" : "modules/home/recommend.html"},
                  {"text" : "探索", "template" : "modules/home/recommend.html"}
                ];
                $scope.tabs = [
                  {"text" : "推薦", "template" : "modules/home/recommend.html"},
                  {"text" : "熱點", "template" : "modules/home/recommend.html"},
                  {"text" : "社會", "template" : "modules/home/recommend.html"},
                  {"text" : "娛樂", "template" : "modules/home/recommend.html"},
                  {"text" : "科技", "template" : "modules/home/recommend.html"},
                  {"text" : "財經", "template" : "modules/home/recommend.html"},
                  {"text" : "國際", "template" : "modules/home/recommend.html"},
                  {"text" : "時尚", "template" : "modules/home/recommend.html"},
                  {"text" : "軍事", "template" : "modules/home/recommend.html"},
                  {"text" : "遊戲", "template" : "modules/home/recommend.html"},
                  {"text" : "美文", "template" : "modules/home/recommend.html"},
                  {"text" : "養生", "template" : "modules/home/recommend.html"}
                ];
                $scope.noTabs = [
                  {"text" : "美食", "template" : "modules/home/recommend.html"},
                  {"text" : "電影", "template" : "modules/home/recommend.html"},
                  {"text" : "育兒", "template" : "modules/home/recommend.html"},
                  {"text" : "歷史", "template" : "modules/home/recommend.html"},
                  {"text" : "故事", "template" : "modules/home/recommend.html"},
                  {"text" : "探索", "template" : "modules/home/recommend.html"}
                ];

              
                $ionicModal.fromTemplateUrl('modules/home/channels.html', {
                  scope: $scope
                }).then(function(modal) {
                  $scope.modal = modal;
                });

              
                $scope.closeChannels = function() {
                  $scope.modal.hide();
                };


                $scope.channels = function() {
                  $scope.modal.show();
                };

                $scope.setTabs = function(index, tab) {
                  if(index == 0) {
                    return;
                  }
                  $scope.tabs.splice(index, 1);
                  $scope.noTabs.push(tab);
                };

                $scope.setNoTabs = function(index, tab) {
                  if($scope.tabs.length > 11) {
                    return;
                  }
                  $scope.noTabs.splice(index, 1);
                  $scope.tabs.push(tab);
                };
            }
        ] );
} );