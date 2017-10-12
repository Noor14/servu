'use strict';

/**
 * @ngdoc service
 * @name servu.host
 * @description
 * # host
 * Constant in the servu.
 */
angular.module('servu')
  .constant('host', 'http://panterasrv.cloudapp.net/servu_api_test/api')
  .constant('cableUrl', 'ws://panterasrv.cloudapp.net/servu_api_test/cable');
