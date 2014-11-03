/**
  *
  * freight.js 1.0.0 (https://github.com/happycog/freightjs)
  * By Happy Cog (http://happycog.com)
  *
  * */
(function($){
	function handler(e){
		var freightTrigger = $(e.target),
			freightKey = freightTrigger.attr('data-freight-trigger'),
			freightTarget = $('[data-freight-target="' + freightKey + '"]'),
			freightEventPrefix = 'freight.' + freightKey + '.',
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

		$.ajax({
			url: requestUrl,
			method: requestMethod,
			data: requestData,
			success: responseHandler,
			error: responseHandler
		});

		function responseHandler(response, textStatus) {
			var afterResponse = $.Event(freightEventPrefix + 'afterResponse');
			$(document).trigger(afterResponse, [response, textStatus]);

			if (freightTarget.length && !afterResponse.isDefaultPrevented()) {
				freightTarget.html(response);
				freightTarget.trigger(freightEventPrefix + 'afterReplacement');
			}
		}

		e.preventDefault();
	}

	$(document).on('click', 'a[data-freight-trigger], button[data-freight-trigger]', handler);
	$(document).on('submit', 'form[data-freight-trigger]', handler);
	$(document).on('change', 'select[data-freight-trigger]', handler);
})(jQuery);
