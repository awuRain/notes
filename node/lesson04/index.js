var benchmark = require('benchmark');

var suite = new benchmark.Suite();

suite.add('+', function () {
	return +'100';
}).add('parseInt', function () {
	return parseInt('100', 10);
}).add('Number', function () {
	return Numer('100');
}).on('cycle', function (event) {
	console.log(String(event.target));
}).on('complete', function () {
	console.log('Faster is' + this.filter('fastest').map('name'));
}).run({'async': true});