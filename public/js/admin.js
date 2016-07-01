$(function(){
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-'+id)
		var ttt = target.data('n')

		if (ttt === 'user') {
			$.ajax({
				type: 'DELETE',
				url: '/admin/user/list?id=' + id
			})
			.done(function(result) {
				if (result.success === 1) {
					if(tr.length > 0){
						tr.remove()
					}
				}
			})
		}
		else {
			$.ajax({
				type: 'DELETE',
				url: '/admin/movie/list?id=' + id
			})
			.done(function(result) {
				if (result.success === 1) {
					if(tr.length > 0){
						tr.remove()
					}
				}
			})
		}
	})

	$('#douban').blur(function() {
		var douban = $(this)
		var id = douban.val()

		if (id) {
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data) {
					$('#inputTitle').val(data.title)
			        $('#inputDoctor').val(data.directors[0].name)
			        $('#inputCountry').val(data.countries[0])
			        $('#inputPoster').val(data.images.large)
			        $('#inputYear').val(data.year)
			        var summarystr = data.summary
			        summarystr = summarystr.slice(0, -3)
			        //含有 @豆瓣 字符 所以 截取倒数第3个前
			        $('#inputSummary').val(summarystr)
				}
			})
		}
	})
})