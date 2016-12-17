//let Graph = require('./graph');
var sqlite3 = require('sqlite3').verbose();
var db;
var tableName;

var Database = function ( name ){
    tableName = name;

    createDB();
}

function createDB() {
    var fs = require("fs");
    var file = "graph.db";
    var exists = fs.existsSync(file);

    if(!exists) {
        console.log("Creating DB file.");
        fs.openSync(file, "w");
    }

    console.log('createDB ' + file );
    db = new sqlite3.Database(file);

    createTable();
}

function createTable() {
    console.log("createTable " + tableName);
debugger;
    db.run("CREATE TABLE IF NOT EXISTS " + tableName + "_node ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, 'node' varchar(64) NOT NULL UNIQUE )");
    db.run("CREATE TABLE IF NOT EXISTS " + tableName + "_edge ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, 'node_one_id' int(11) NOT NULL, 'node_two_id' int(11) NOT NULL, 'relationship' varchar(64) NOT NULL )");

    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS graph ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, 'name' varchar(64) NOT NULL UNIQUE)");
        insertMain();
    });


}

function insertMain() {

    db.serialize(function(){

        db.run("INSERT INTO graph VALUES (0, 'test')", function(err, row){
            if(err) console.log(err);
        });

        db.run("INSERT OR IGNORE INTO graph SELECT NULL, '" + tableName + "' FROM graph WHERE NOT EXISTS ( SELECT 1 FROM graph g WHERE g.name = '" + tableName + "' ) limit 1");

        db.run("DELETE FROM graph WHERE id = 0");
    });

}

Database.prototype.saveGraph = function ( graph ){
    console.log("insertRows ");

    if ( !graph || !graph.node_list ) {
        console.log("Error saving graph");
        return;
    }

    db.serialize(function() {

        for(var i = 0; i < graph.node_list.length; i ++){
            if ( graph.node_list[i] ) {

                db.run("INSERT OR IGNORE INTO " + tableName + "_node (id, node) VALUES (NULL, '" + graph.node_list[i].name + "') ",  [], function(err, row) {
                    if(err) console.log(err);
                });
            }
        }

        for(var i = 0; i < graph.node_list.length; i ++){
            if ( graph.node_list[i] ) {
                db.run("INSERT INTO " + tableName + "_edge (id, node_one_id, node_two_id, relationship) VALUES (0, '0', '0', 'test')");

                for(var key in graph.node_list[i].edge_list){
                    if (key && graph.node_list[i].edge_list[key]) {

                        for(var j = 0; j < graph.node_list[i].edge_list[key].length; j ++) {
                            let node1 = graph.node_list[i].name;
                            let node2 = key;
                            let relationship = graph.node_list[i].edge_list[key][j];
                            let query1 = "INSERT INTO " + tableName + "_edge (id, node_one_id, node_two_id, relationship) SELECT NULL, (SELECT id FROM " + tableName + "_node WHERE node like '" + node1 + "') AS id1, (SELECT id FROM " + tableName + "_node WHERE node like '" + node2 + "') AS id2, '" + relationship + "' FROM " + tableName + "_edge WHERE NOT EXISTS ( SELECT 1 FROM " + tableName + "_edge e inner join " + tableName + "_node n on n.id = e.node_one_id inner join " + tableName + "_node n2 on n2.id = e.node_two_id WHERE n.node like '" + node1 + "' and n2.node like '" + node2 + "' and e.relationship like '" + relationship + "' ) limit 1";
                            //console.log(query1);

                            db.run(query1, [],
                                function(err, row) {
                                    if(err) console.log(err);
                                }
                            );

                        }

                    }
                }

                db.run("DELETE FROM " + tableName + "_edge WHERE id = 0 and node_one_id = 0 and node_two_id = 0 and relationship like 'test'");

            }
        }

    });

    console.log("DONE ");
}

Database.prototype.getGraph = function( callback ){

    console.log("Get all relationships and nodes");
    var query = "SELECT n.node AS start, n2.node AS end, e.relationship AS relationship from " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id ";

    db.all(query, function(err, rows) {

        if (err){
            console.log('error in searchNode ' + err);
            callback("error");
            return;
        }

        console.log( "graph = [" );
        if(rows){
            rows.forEach( function (row) {
                console.log("start: " + row.start + ", end: " + row.end + ", relationship: " + row.relationship );
            });
        }
        console.log("]");
        callback(rows);
        console.log("Finish getGraph");
        return;

    } );

}

Database.prototype.searchNode = function( nodeName, callback ){
    console.log("Searching node");
    var query = "SELECT n.node AS node FROM " + tableName + "_node n WHERE n.node like '%" + nodeName + "%' ";

    db.all(query, function(err, rows) {

        if (err){
            console.log('error in searchNode ' + err);
            callback("error");
            return;
        }

        console.log( nodeName + " can be found in nodes [" );
        if(rows){
            rows.forEach( function (row) {
                console.log(row.node);
            });
        }
        console.log("]");
        callback(rows);
        console.log("Finish searching node");
        return;
    } );

}

Database.prototype.searchEdge = function( edge, callback ){
    console.log("Searching edge");

    var query;
    if(edge)
        query = "SELECT n.node AS start, n2.node AS end, e.relationship AS relationship FROM " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id WHERE e.relationship like '%" + edge + "%' ";
    else {
        query = "SELECT n.node AS start, n2.node AS end, e.relationship AS relationship FROM " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id WHERE e.relationship like '' ";
    }

    db.all(query, function(err, rows) {

        if (err){
            console.log('error in searchEdge ' + err);
            callback("error");
            return;
        }

        console.log( edge + " can be found in edge between start and end node [" );
        if(rows){
            rows.forEach( function (row) {
                console.log("edge: " + row.relationship + ", start: " + row.start + ", end: " + row.end);
            });
        }
        console.log("]");
        callback(rows);
        console.log("Finish searching edge");
        return;
    } );

}

Database.prototype.listIncomingEdge = function ( nodeName, callback ) {

    var query = "SELECT n.node AS node, e.relationship AS relationship FROM " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id WHERE n2.node like '" + nodeName + "' ";

    db.all(query, function(err, rows) {

        if (err){
            console.log('error in listIncomingEdge ' + err);
            callback("error");
            return;
        }

        console.log( nodeName + " has incmoing edges from [" );
        if(rows){
            rows.forEach( function (row) {
                console.log(row.node + ": " + row.relationship);
            });
        }
        console.log("]");
        callback(rows);
        console.log("Finish listing incoming edge");
        return;
    } );

}

Database.prototype.listOutgoingEdge = function ( nodeName, callback ) {

    var query = "SELECT n2.node AS node, e.relationship AS relationship FROM " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id WHERE n.node like '" + nodeName + "' ";

    db.all(query, function(err, rows) {

        if (err){
            console.log('error in listOutgoingEdge ' + err);
            callback("error");
            return;
        }

        console.log( nodeName + " has outgoing edge to [" );
        if(rows){
            rows.forEach( function (row) {
                console.log(row.node + ": " + row.relationship);
            });
        }
        console.log("]");
        callback(rows);
        console.log("Finish listing outgoing edge");
        return;
    } );
}

Database.prototype.listAllRelationship = function ( nodeName, callback ) {
    // "SELECT n2.node AS node2, e.relationship AS relationship FROM " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id WHERE n.node like '" + nodeName + "' OR n2.node like '" + nodeName + "' "
    var query = "SELECT n2.node AS node, e.relationship AS relationship FROM " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id WHERE n.node like '" + nodeName + "' UNION SELECT n.node AS node, e.relationship AS relationship FROM " + tableName + "_edge e INNER JOIN " + tableName + "_node n ON n.id = e.node_one_id INNER JOIN " + tableName + "_node n2 ON n2.id = e.node_two_id WHERE n2.node like '" + nodeName + "' ";

    db.all(query, function(err, rows) {

        if (err){
            console.log('error in listing ' + err);
            callback("error");
            return;
        }

        console.log( nodeName + " has relationship with [" );
        if(rows){
            rows.forEach( function (row) {
                console.log(row.node + ": " + row.relationship);
            });
        }
        console.log("]");
        callback(rows);
        console.log("Finish listing all related edge");
        return;
    } );

}

Database.prototype.cleanUnrelated = function() {
    // TODO clean all empty node
    //var query = "SELECT n2.id FROM `test_edge` e RIGHT JOIN test_node n ON n.id = e.node_one_id RIGHT JOIN test_node n2 ON n2.id = e.node_two_id WHERE n.id IS NULL";

}

Database.prototype.deleteAll = function() {
    console.log("Empty database");
    db.run("DELETE FROM " + tableName + "_edge");
    db.run("DELETE FROM " + tableName + "_node");
}

Database.prototype.deleteAllEdge = function() {
    db.run("DELETE FROM " + tableName + "_edge");
}

Database.prototype.closeDb = function(){
    console.log("closeDb");
    db.close();
}

module.exports = Database;
