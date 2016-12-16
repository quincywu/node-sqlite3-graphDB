# Node-sqlite3 Graph Database

This is Problem 5 on the EE590 final homework. This project implement a graph database APT in Javascript in Node and Sqlite3.
A graph is a set of nodes and a set of edges. Nodes can have data associated with them. Edges connect a source node with a destination node, and can also have data associated with them. The data the each node carry is a string. The User can create a graph and then save it in the database file.

Graph can be define with subject, object, predicate

## Getting Started

To get start, you can download the files available on Github, and put it in the source folder. Import the file to the require files.

### Prerequisites

Check out the link below to install node and sqlite3
https://github.com/mapbox/node-sqlite3

On Ubuntu:
    sudo apt-get install node
    sudo apt-get install sqlite3

### Installing

Import the graph.js and db.js in the source code.
For example:    let Database = require('./src/db');
                let Database = require('./src/graph');


Client.js is a working example of the graph class and db class.

### Design choice

When I start the project, I was writing a bi-directional graph. When I was about to finished I modified the code to a directional graph with subject node and object node with a relationship predicate.

On the database, it is separate into 3 tables.
 - graph table, store all different database created by the Users, ** NO duplicate database allowed **
 - userDefined_node table, store all nodes in the database, ** NO duplicate node allowed **
 - userDefined_edge table, store all edges, subject_node id, and object_node id. Subject_node_id is related to object_node_id with relationship edge. A node can relate to any node more than once in different relationship, including self. ** NO duplicate relationship between two of the same node is allowed, NODE_A CANNOT RELATED TO NODE_B WITH SAME relationship TWICE **
And for each database added by the user, 2 more tables are added xxxx_node, xxxx_edge, and add an entry to the graph table.

### Documentation

- node.js
    * Node#Node( name )
        - Constructor create empty node with name parameter. Has properties name and edge_list
    * Node#addEdge( end_node, edge_name = "" )
        - Set current node relate to end_node with relationship edge_name, edge_name is optional.
    * Node#deleteEdge( end_node, edge_name = "" )
        - Delete relationship with end_node, if no edge_name is provide delete relationship matching '' with edge_name, if edge_name is provide delete one relationship matching edge_name with end_node
    * Node#deleteAllEdge( end_node )
        - Delete all relationship with end_node
    * Node#modifyNode
        - Modify the name of the node. Graph does not use this function. (deprecated)

- graph.js
    * Graph#Graph()
        - Constructor create empty graph. Has properties node_list
    * Graph#addEdge( start_node, end_node, relationship = '' )
        - Add Edge between start_node to end_node with relationship [optional], ** directional **
    * Graph#addMultEdge( objArray )
        - Add multiple Edge as an array. objArray has the format [['start_node', 'end_node', 'relationship'], [...], ...]
    * Graph#deleteEdge ( start_node, end_node, relationship = '' )
        - Delete edge on a graph between start_node and end_node with relationship [optional]
    * Graph#deleteNode( node )
        - Delete node on the graph, and all relationship with node
    * Graph#printNodes
        - Display all nodes and relationships on graph

- db.js
    * Database#Database( name )
        - Constructor create empty database with name parameter, and create tables of later transactions.
    * Database#saveGraph( graph )
        - Save graph to the database. This function only add new relationship and new node into the database. It does not modify existing node and edge.
        - To save every connection in graph, user function `deleteAllEdge()` or `deleteAll()` to clear the database before saving new graph.
    * Database#getGraph( callback ) //TODO
        - Get entire graph in database. Display result in console and Use callback function to display to client who called this method.
    * Database#searchNode( nodeName, callback )
        - Search database for node data partly or fully match the input string. Display result on console, and callback function(rows) where each row = ['node1']
    * Database#searchEdge( edge, callback )
        - Search database for edge data party or fully match the input string. if input edge is not provided, it would search for empty edge ''. Display result on console, callback function(rows) where each row = ['start', 'end', 'relationship']
    * Database#listIncomingEdge( nodeName, callback )
        - Search database for incoming edge to nodeName. The algorithm search for end_node equals nodeName. Display result on console, callback function(rows) where each row = ['node', 'relationship']
    * Database#listOutgoingEdge( nodeName, callback )
        - Search database for outgoing edge of nodeName. The algorithm search for start_node equals nodeName. Display result on console, callback function(rows) where each row = ['node', 'relationship']
    * Database#listAllRelationship( nodeName, callback )
        - Search database for all relationship with nodeName. The algorithm search for start_node or end_node equals nodeName. Display result on console, callback function(rows) where each row = ['node', 'relationship']
    * Database#cleanUnrelated() // TODO

    * Database#deleteAll()
        - Delete all entry in database in both userDefined_node table and userDefined_edge table
    * Database#deleteAllEdge()
        - Delete all edges in database in userDefined_edge table
    * Database#closeDb()
        - Close database, recommend to do after every database opened.



## Versioning or Future development

This project can develop to fit all database, different implementation of graph and different data in the node beside string. For the future, the user would also be able to choose to implement directional and bi-directional graph, or tree graph. The database would also be available to store different node's data, such as json object. And implement more database operation for the user, such as Database#cleanUnrelated(), Database#getGraph( callback ).
