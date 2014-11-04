/**
  *
  * freight.js 1.0.0 (https://github.com/happycog/freightjs)
  * By Happy Cog (http://happycog.com)
  *
  * */
(function($){
	$(function() {
		function handler(e){
			var freightTrigger = $(e.target),
				freightKey = freightTrigger.attr('data-freight-trigger'),
				freightTarget = $('[data-freight-target="' + freightKey + '"]'),
				freightEventSuffix = '.' + freightKey + '.freight',
				requestUrl,
				requestMethod,
				requestData;

			switch (freightTrigger.prop('tagName')) {
				case 'INPUT':
				case 'SELECT':
				case 'BUTTON':
				case 'FORM':
					var closestForm = freightTrigger.closest('form'),
						closestAction = freightTrigger.closest('[data-freight-action]'),
						closestMethod = freightTrigger.closest('[data-freight-method]');
					requestUrl = (closestAction.length)?closestAction.attr('data-freight-action'):closestForm.attr('action');
					requestMethod = (closestMethod.length)?closestMethod.attr('data-freight-method'):closestForm.attr('method');
					requestData = closestForm.serialize();
					break;

				default:
					requestUrl = (freightTrigger.attr('data-freight-href'))?freightTrigger.attr('data-freight-href'):freightTrigger.attr('href');
					requestMethod = (freightTrigger.attr('data-freight-method'))?freightTrigger.attr('data-freight-method'):'get';
					requestData = (freightTrigger.attr('data-freight-data'))?freightTrigger.attr('data-freight-data'):'';
					break;
			}

			if (freightTrigger.attr('data-freight-request') !== 'active') {
				freightTrigger.attr('data-freight-request', 'active');
				$.ajax({
					url: requestUrl,
					method: requestMethod,
					data: requestData,
					success: responseHandler,
					error: responseHandler,
					beforeSend: function(jqXHR, settings) {
						var beforeRequest = $.Event('beforeRequest' + freightEventSuffix);
						$(document).trigger(beforeRequest, [jqXHR, settings]);

						return !beforeRequest.isDefaultPrevented();
					},
					complete: function() {
						freightTrigger.removeAttr('data-freight-request');
					}
				});
			}

			function responseHandler(response, textStatus) {
				var afterResponse = $.Event('afterResponse' + freightEventSuffix);
				$(document).trigger(afterResponse, [response, textStatus]);

				if (freightTarget.length && !afterResponse.isDefaultPrevented()) {
					freightTarget.html(response);
					freightTarget.trigger('afterReplacement' + freightEventSuffix);
				}
			}

			e.preventDefault();
		}

		$(document).on('click', 'a[data-freight-trigger], button[data-freight-trigger]', handler);
		$(document).on('submit', 'form[data-freight-trigger]', handler);
		$(document).on('change', 'select[data-freight-trigger]', handler);
	});
})(jQuery);
