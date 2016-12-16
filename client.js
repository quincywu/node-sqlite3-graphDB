// import classes needed
let Database = require('./db');
let Graph = require('./graph');

var graph = new Graph();  // create graph object
graph.addEdge("start","end"); // add edge between two node with no relationship
graph.addEdge("start","dest");
graph.addEdge("start","finish", "100"); // add edge between two node with relationship
graph.addEdge("here","there", "dont");
graph.addEdge("up","down", "yes");

graph.printNodes();
console.log("\n");
/*
output format as start_node: { end_node: [ relationship, ... ], ... }

start:
{ end: [ '' ], dest: [ '' ], finish: [ '100' ] }
end:
{}
dest:
{}
finish:
{}
here:
{ there: [ 'dont' ] }
there:
{}
up:
{ down: [ 'yes' ] }
down:
{}
*/

// You can save multiple graph on to the database, but would not be able to retrive by each.
// output result would be one graph including multiple graph

var graph2 = new Graph();
var multedge = [
    ["gar","cri","partnar"],
    ["cri","gar","partnar"],
    ["gar","qui","sameroom"],
    ["cay","qui", "friend"],
    ["cay","qui", "oppo"],
    ["cay","qui", "active"],
    ["qui","cay", "active"]
];
graph2.addMultEdge( multedge );// create nodes and relationships between them as follow in array

graph2.addEdge("qui","qui");
graph2.addEdge("qui","start");
graph2.addEdge("qui","start","UW");
graph2.addEdge("qui","end","UW");
graph2.addEdge("qui","start","EE"); // allow multiple connection with same node

graph2.printNodes();
console.log("\n");

console.log("delete node 'gar', delete 'qui' relationship with 'qui', delete all 'cay' relationship with 'qui' ");
graph2.deleteNode("gar"); // delete node and all realated edge to it
graph2.deleteEdge("qui", "qui"); // delete connection from qui to qui with empty relationship
graph2.deleteAllEdge("cay", "qui", false); // delete all connections between cay to qui and qui to cay

graph2.printNodes();
console.log("\n");

console.log("clean graph");
graph2.clean();
graph2.printNodes();
console.log("Finished clean graph\n");

var db = new Database('graphDB'); // create a database object
db.saveGraph(graph); // save multiple graphs
db.saveGraph(graph2);

db.searchNode('q', function (rows) {
    if(rows === "error")
        console.log("searchNode has error");
});
console.log("\n");

db.searchNode('abcdefg', function (rows) {
    if(rows === "error")
        console.log("searchNode has error");
});
console.log("\n");

db.searchEdge('UW', function (rows){
    if(rows === "error")
        console.log("searchNode has error");
    else {
        if(rows){
            console.log("methods chaining");
            rows.forEach( function (row) {
                db.listAllRelationship(row.start, function(rows){
                    if(rows === "error")
                        console.log("list all relationship has error in chaining");
                });
            });
            console.log("\n");
        }
    }

});
console.log("\n");


// callback method return rows from database
// rows = [{node: related_node_name, relationship: relationship_with_input_node}, ... ]
db.listAllRelationship("qui", function(rows) {
    var returnvalue = rows;
    console.log("example = " + returnvalue[0].node);
    if(returnvalue !== "error")
        for(var i = 0; i < returnvalue.length; i ++){
            for(var key in returnvalue[i]){
                console.log(key + ": " + returnvalue[i][key])
            }
        }

});

db.closeDb();
