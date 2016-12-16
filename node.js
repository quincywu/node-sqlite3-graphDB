var Node = function( name ){
    this.edge_list = {};
    this.name = name;
}

Node.prototype.addEdge = function( end, edge_name = "" ) {

    if ( this.edge_list[end] ) {

        var i = 0;
        for ( i = 0; i < this.edge_list[end].length; i ++ ) {
            if ( this.edge_list[end][i] === edge_name ) {
                break;
            }
        }

        this.edge_list[end][i] = edge_name;

    } else {
        this.edge_list[end] = [edge_name];
    }

}

Node.prototype.deleteEdge = function ( end, edge_name = '' ) {

    if ( this.edge_list[end] ){
        for ( var i = 0; i < this.edge_list[end].length; i ++ ) {
            if ( this.edge_list[end][i] === edge_name ) {
                delete this.edge_list[end][i];
            }
        }
    }

}

Node.prototype.deleteAllEdge = function ( end ) {
    // no need to check with if statement, delete anyhow
    //if ( this.edge_list[end] ){
        delete this.edge_list[end];
    //}

}

Node.prototype.modifyNode = function ( name ) {
    // if no node is same name
    this.name = name;
}

module.exports = Node;
