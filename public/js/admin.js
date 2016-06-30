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
})