// Create a YUI sandbox on your page.
YUI().use('node', 'event', 'intl', function (Y) {
	// The Node and Event modules are loaded and ready to use.
	// Your code goes here!

	var goalsCount = 1;

	Y.one('#add-goal').on('click', function(e){
		e.preventDefault();

		goals.add().one('input').focus();

		goalsCount++;
	});

	Y.delegate('click', function(e){
		e.preventDefault();

		if(goalsCount > 1){
			this.ancestor('.input-append').remove();
			goals.save();
			goalsCount--;
		}else{
			this.previous('input').set('value', "");
			localStorage.removeItem('goals');
			goalsCount = 1;
		}
	}, Y.one('body'), '.btn-remove');

	Y.one('#save-goals').on('click', function(e){
		e.preventDefault();

		goals.save();
	});

	Y.one('#remove-goals').on('click', function(e){
		e.preventDefault();

		Y.all('.input-append').remove();
		goals.add();

		localStorage.removeItem('goals');
	});

	var goals = {
		_constructor: function(){
			goals.load();
		},
		save: function(){
			var ls = {'itens':[]};

			Y.all('input').each(function(input){
				if(!input.get('value').isNull()){
					ls.itens.push(input.get('value'));
				}
			});

			if(ls.itens.length > 0){
				localStorage.setItem('goals',JSON.stringify(ls));
				goals.alert('Their goals were saved successfully','success');
			}else{
				goals.alert('Their goals were empty','error');
			}
		},
		alert: function(message,type){
			Y.all('.alert').remove();
			var alert = Y.Node.create('<div class="alert alert-'+type+'">'+message+'</div>');
			Y.one('legend').insert(alert,'after');
		},
		add: function(){
			var insertAfter, template = Y.one('#input-goal-template').getHTML()

			if(Y.one('.input-append:last-of-type') != null)
				insertAfter = '.input-append:last-of-type';
			else
				insertAfter = 'legend';

			Y.one(insertAfter).insert(template,'after');

			return Y.one('.input-append:last-of-type');
		},
		load: function(){
			var data = localStorage.getItem('goals');
			if(data!=undefined){	
				var ls = JSON.parse(data), input, goal;

				Y.all('.input-append').remove();

				for(var i = 0; i < ls.itens.length; i++){
					item = ls.itens[i];

					goal = goals.add();
					goal.one('input').set('value',item);
				};

				goalsCount = ls.itens.length;
			}
		}
	};

	goals._constructor();
});

String.prototype.isNull = function(){
    if(this != null && this != undefined) {
        value = this.toString();
    }
        
    if(value === null || value === undefined || value.replace(/^\s+|\s+$/g, '') === "") {
        return true;
    } else {
        return false;
    }
};