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
graph2.addEdge("gar","cri","partnar");
graph2.addEdge("cri","gar","partnar");
graph2.addEdge("gar","qui","sameroom");
graph2.addEdge("cay","qui", "friend");
graph2.addEdge("qui","qui");
graph2.deleteNode("gar"); // delete node and all realated edge to it

graph2.printNodes();

var db = new Database('graphDB'); // create a database object
db.saveGraph(graph); // save multiple graphs
db.saveGraph(graph2);

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
