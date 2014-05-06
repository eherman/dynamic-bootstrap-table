define([
], function() {

	var exposed = {
		generateData: function() {
			var data = [];
			for(var i=0; i<100; i++) {
				data.push(
					{
						"ID": i,
						"Name": "Fake Name",
						"Lat": "90",
						"Lon": "90",
						"City": "Fake City",
						"Phone": "555-867-5309",
						"Description": "Sexy and I know itSexy and I know itSexy and I know itSexy and I know itSexy and I know itSexy and I know itSexy and I know itSexy and I know it",
					}
				);
			}
			data.push(
				{
					"ID": 100,
					"Name": "Bruce Wayne",
					"Lat": "99",
					"Lon": "99",
					"City": "Gotham City",
					"Phone": "555-555-5555",
					"Description": "I'm Batman",
				}
			);
			data.push(
				{
					"ID": 101,
					"Lat": "99",
					// "Name": "Clak Kent",
					"Lon": "99",
					"City": "Metropolis",
					"Phone": "555-555-SUPE",
					"Description": "I'm Superman"
				}
			);
			data.push(
				{
					"ID": 102,
					"Name": "Clak Kent",
					"Lat": "66",
					"Lon": "66",
					"City": "Metropolis",
					"Phone": "555-555-SUPE",
					"Description": "I'm Superman"
				}
			);
			return data;
		},
		getColumns: function() {
			return ["ID", "Name", "Lat", "Lon", "City", "Phone", "Description"];
		},
		getNewData: function() {
			return [
				{
					"ID": 999,
					"Name": "Joker",
					"Lat": "13",
					"Lon": "13",
					"City": "Arkham Asylum",
					"Phone": "BAT-MAN-SUXS",
					"Description": "Hahahaha!"
				}
			];
		}
	};

	return exposed;

});