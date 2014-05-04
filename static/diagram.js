/*
Notes:
1 line high: qnot, srn, hadamard, utheta, u2, measure
2 lines high: cnot, swap, cphase
n lines high: oracle
*/

function CircuitObject(containerID) {
	var container = d3.select("#" + containerID);

	var componentSymbols = {
		, "qnot": "X"
		, "srn": "S"
		, "hadamard": "H"
		, "utheta": "U&theta;"  // I believe this is the correct code
		, "cnot": "url(1)"  // An image?
		, "swap": "url(2)"  // An image?
		, "cphase": "url(3)"  // Possible image?
		, "u2": "U"
		, "measure": "M"
		, "oracle": "O"
	};

	function Component(name, rows, columnNum) {
		this.sym = componentSymbols[name];
		this.rows = rows;
		this.columnNum = columnNum;
		return this;
	}

	function expressionToComponent(expression) {
		var fnName = expression._fn_meta._name,
			qubits = [];
			lineNum = expression._line_number;
		for(i=0;i<expression._qubits.lenth;i++){
			qubits[i]=expression._qubits[i]._value;
		};
		return new Component(fnName, qubits, lineNum);
	}

	this.render = function(numQubits, expressions){
		var containerHeight = parseInt(container.style("height")),
			rowHeight = containerHeight / numQubits,
			columnWidth = rowHeight;

		var componentData = [];
		for(i=0;i<expressions.length;i++) {
			componentData[i] = expressionToComponent(expressions[i]);
		};

		var wireData = [];
		for(i=0;i<numQubits;i++) {
			wireData[i].name = "ABCDEFGHIJ"[i];
		};

		var wire = container.selectAll(".wire").data(wireData);

		wire.enter().append("line")
			.attr("class", "wire");

		wire.attr("height", rowHeight)
			.attr("width", columnWidth * componentData.length);

		wire.exit()
			.remove();

		var component = conatiner.selectAll(".component").data(componentData);

		function positionComponent(cmpnt) {
			return "translate("
				cmpnt.columnNum * columnWidth + ","
				Math.min(cmpnt.rows) * rowHeight + 
			")"
		}

		component.enter().append("")
			.attr("width", columnWidth)
			.attr("height", rowHeight)
			.attr("transform", positionComponent)
			.attr("contents", function(d) {return d.sym});

		component.exit()
			.remove();
}
