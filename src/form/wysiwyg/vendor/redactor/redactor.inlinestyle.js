module.exports =
function()
{

	  //   return {
			// langs: {
			// 	en: {
			// 		"style": "Style"
			// 	}
			// },
	  //       init: function()
	  //       {
	  //           var dropdown = {};
	 
	  //           dropdown.option1 = { title: 'Kék', func: this.inlinestyle.optionCallback };
	  //           dropdown.option2 = { title: 'Világoskék', func: this.inlinestyle.optionCallback };
	 
	  //           var button = this.button.add('theme', 'theme');
			// 	var button = this.button.addAfter('formatting', 'theme icon', this.lang.get('style'));
	  //           // this.button.setAwesome('theme', 'theme icon');
	 
	  //           this.button.addDropdown(button, dropdown);
	  //       },
	  //       optionCallback: function(buttonName)
	  //       {
	  //       	console.log(buttonName);
	  //       	console.log(args);
	  //       	this.inline.format('span', 'class', 'blue');
	  //       },
	  //   };



	return {
		styles: {
			"blue": {
				title: "Kék",
				args: ['span', 'class', 'blue']
			},
			"bluelight": {
				title: "Világoskék",
				args: ['span', 'class', 'bluelight']
			},
			"red": {
				title: "Piros",
				args: ['span', 'class', 'red']
			}
		},

		init: function()
		{
			var that = this;
			var dropdown = {};

			$.each(this.inlinestyle.styles, function(i, s)
			{
				dropdown[i] = { title: s.title, func: that.inlinestyle.onClickHandler, args: s.args };
			});

			var button = this.button.addAfter('formatting', 'backcolor', 'Styles');
			this.button.addDropdown(button, dropdown);

		},
		onClickHandler: function(dropdownIndex)
		{
			var args = this.inlinestyle.styles[dropdownIndex].args;
			this.inline.format(args[0], args[1], args[2]);
		}
	};
};
