/* global angular, d3 */
'use strict';

(function(){
	var opts = {
		h:300,
		ybuffer: 30,
		bottom:18
	};
	var config = {
		restrict:'E',
		replace:true,
		template:'<div class="graph"></div>',
		scope:{
			data:'='
		}
	};
	function Graph ($scope, el) {

		var svg = d3.select(el[0]).append('svg')
			.attr({
				width:el.width(),
				height:opts.h
			}),
			hourScale,
			balanceScale,
			flatLine,
			curve,
			path,
			xAxis,
			_xAxis,
			bottomBar,
			cpoints,
			updateScales = function(){
				balanceScale = d3.scale.linear()
					.domain(d3.extent($scope.data,function(d){return d.balance;}))
					.range([0, opts.h-opts.ybuffer]);
				hourScale = d3.scale.linear()
					.domain(d3.extent($scope.data,function(d){return d.hour;}))
					.range([0, el.width()]);

				xAxis = d3.svg.axis().scale(hourScale).orient('bottom').ticks(14).tickFormat(function(d){
					return d+':00';
				});
				if(_xAxis){
					_xAxis.call(xAxis);
				}
			},
			updatePath = function(){
				curve = d3.svg.line()
				.x(function(d){
					return hourScale(d.hour);
				})
				.y(function(d){
					return opts.h - balanceScale(d.balance) + opts.ybuffer;
				})
				.interpolate('monotone');

				path.transition()
					.duration(2500)
					.ease('elastic')
					.attr({
						d:curve
					});
			},
			updateOnResize = function(){
				svg.attr({
					width:el.width()
				});
				updateScales();
				updatePath();
			};

		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.html(function(d) {
				console.log(d);
				return '<span>' + d.balance + '</span>';
			})
			.offset([-12, 0]);

		svg.call(tip);

		//insert one 0 point at each end
		$scope.data.unshift({
			hour:$scope.data[0].hour-1,
			balance:0
		});
		$scope.data.push({
			hour:$scope.data[$scope.data.length-1].hour+1,
			balance:0
		});

		updateScales();

		//draw flat line
		flatLine = d3.svg.line()
			.x(function(d){
				return hourScale(d.hour);
			})
			.y(function(){
				return opts.h;
			})
			.interpolate('monotone');

		createGradient(svg);

		//draw flat line
		path = svg.append('path')
			.data([$scope.data])
			.attr({
				d:flatLine,
				fill:'url(#gradient)',
				stroke:'#ffea00',
				'stroke-width':2
			});

		//draw points
		cpoints = svg.selectAll('g.cpoint')
			.data($scope.data)
			.enter()
			.append('g')
			.attr({
				'class':'cpoint'
			})
			.each(function(){
				d3.select(this)
				.append('circle')
				.attr({
					'class':'outer',
					cx: function(d){
						return hourScale(d.hour);
					},
					cy:function(d){
						return opts.h- balanceScale(d.balance) + opts.ybuffer;
					},
					r:0,
					opacity:0
				});
				d3.select(this)
				.append('circle')
				.attr({
					'class':'front',
					cx: function(d){
						return hourScale(d.hour);
					},
					cy:function(d){
						return opts.h- balanceScale(d.balance) + opts.ybuffer;
					},
					r:0,
					opacity:0
				});

				d3.select(this)
				.append('circle')
				.attr({
					'class':'back',
					cx: function(d){
						return hourScale(d.hour);
					},
					cy:function(d){
						return opts.h- balanceScale(d.balance) + opts.ybuffer;
					},
					r:20,
					fill:'#ccc',
					opacity:0
				});
			})
			.on('mouseover',function(d,i){
				d3.select(this).select('.outer')
				.transition()
				.duration(950).ease('elastic')
				.attr({
					opacity:0.9,
					r:10
				});
				d3.select(this).select('.front')
				.transition().delay(100)
				.duration(950).ease('elastic')
				.attr({
					opacity:1,
					r:7
				});
				tip.show(d,i);
			})
			.on('mouseout',function(d,i){
				d3.select(this).select('.outer')
				.transition().delay(150)
				.duration(250)
				.attr({
					opacity:0,
					r:0.3
				});
				d3.select(this).select('.front')
				.transition()
				.duration(250)
				.attr({
					opacity:0,
					r:0.3
				});
				tip.hide(d,i);
			});
		//draw axis 
		bottomBar = svg.append('path')
			.attr({
				d: template('M{x1},{y2} {x1},{y1} {x2},{y1} {x2},{y2}', {x1:0, x2: el.width(), y1:opts.h-opts.bottom, y2:opts.h}),
				'class':'bottom-bar'
			});
		_xAxis = svg.append('g').attr({
		    'class':'axis',
		    transform:'translate('+ [0, opts.h-opts.bottom-4] +')'
		}).call(xAxis);

		//animate in the graph
		setTimeout(updatePath,1000);

		angular.element(window).resize(updateOnResize);
	}

	config.link = Graph;

	angular.module('getix').directive('graph',[function(){
		return config;
	}]);

	function template (tpl,obj) {
		for(var o in obj){
			tpl = tpl.replace(new RegExp('{'+o+'}','g'),obj[o]);
		}
		return tpl;
	}

	function createGradient (svg) {
		var gradient = svg.append('svg:defs')
			.append('svg:linearGradient')
			.attr('id', 'gradient')
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '0%')
			.attr('y2', '100%')
			.attr('spreadMethod', 'pad');

		gradient.append('svg:stop')
			.attr('offset', '0%')
			.attr('stop-color', '#626262')
			.attr('stop-opacity', 0.85);

		gradient.append('svg:stop')
			.attr('offset', '100%')
			.attr('stop-color', '#474747')
			.attr('stop-opacity', 0.85);
	}
})();