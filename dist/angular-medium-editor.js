/**
 * angular-medium-editor
 * @version v0.1.0 - 2015-05-20
 * @link https://github.com/thijsw/angular-medium-editor
 * @author Thijs Wijnmaalen <thijs@wijnmaalen.name>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('angular-medium-editor', [])

  .directive('mediumEditor', function() {

    function toInnerText(value) {
      var tempEl = document.createElement('div');
      tempEl.innerHTML = value;
      return tempEl.innerText.trim();
    }

    return {
      require: 'ngModel',
      restrict: 'AE',
      scope: { bindOptions: '=' },
      link: function(scope, iElement, iAttrs, ngModel) {

        angular.element(iElement).addClass('angular-medium-editor');

        // Global MediumEditor
        ngModel.editor = new MediumEditor(iElement, scope.bindOptions);

        ngModel.$render = function() {
          iElement.html(ngModel.$viewValue);
          ngModel.editor.placeholders.updatePlaceholder(iElement[0]);
        };

        ngModel.$isEmpty = function(value) {
          if (/[<>]/.test(value)) {
            return toInnerText(value).length === 0;
          } else {
            return value.length === 0;
          }
        };

        ngModel.editor.subscribe('editableInput', function (event, editable) {
          ngModel.$setViewValue(editable.innerHTML.trim());
        });

        scope.$watch('bindOptions', function(bindOptions) {
          ngModel.editor.init(iElement, bindOptions);
        });
      }
    };

  });
