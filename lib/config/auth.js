// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '660648423971920', // your App ID
		'clientSecret' 	: '54702c2bf162e1014099e4361392de01', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'smugmugAuth' : {
		'consumerKey' 		: 'nYFDMtxJOTI7QhSkVkmYp6ER0coIqhWB', // your App ID
		'consumerSecret' 	: '9f13298c70ae62e85ed40a9247ec4adc', // your App Secret
		'callbackURL' 	: 'http://127.0.0.1:9000/auth/smugmug/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'zgpdDS5yzJWjPMvVgIJ4fQ',
		'consumerSecret' 	: 'Kk6s9OxgGzrE6x3ycUxaxiCx8YLbDe79YdYfMiYLH00',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '163298164472.apps.googleusercontent.com',
		'clientSecret' 	: 'gC8Ze2T1bEHz1WFXne8kBvKE',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};