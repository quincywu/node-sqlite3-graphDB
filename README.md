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
    ```
    sudo apt-get install node
    sudo apt-get install sqlite3
    ```

### Installing

Import the graph.js and db.js in the source code.
For example:    `let Database = require('./src/db');`
                `let Database = require('./src/graph');`


Client.js is a working example of the graph class and db class.

### Design choice

When I started the project, I was writing a bi-directional graph. When I was about to finished I modified the code to a directional graph with subject node and object node with a relationship predicate.

On the database, it is separated into 3 tables.
 - graph table, store all different database created by the Users, ** NO duplicate database allowed **
 - userDefined_node table, store all nodes in the database, ** NO duplicate node allowed **
 - userDefined_edge table, store all edges, subject_node id, and object_node id. Subject_node_id is related to object_node_id with relationship edge. A node can relate to any node more than once in different relationship, including self. ** NO duplicate relationship between two of the same node is allowed, NODE_A CANNOT RELATED TO NODE_B WITH SAME relationship TWICE **
And for each database added by the user, 2 more tables are added xxxx_node, xxxx_edge, and add an entry to the graph table.
In database, the user is able to connect 2 graph objects together by saving into the same database and have one node exists in both graph.

### Documentation

See [Documentation](https://github.com/quincywu/node-sqlite3-graphDB/wiki/Documentation) in wiki page.

## Versioning or Future development

This project can develop to fit all database, different implementation of graph and different data in the node beside string. For the future, the user would also be able to choose to implement directional and bi-directional graph, or tree graph. The database would also be available to store different node's data, such as json object. And implement more database operation for the user, such as Database#cleanUnrelated(), Database#getGraph( callback ).
