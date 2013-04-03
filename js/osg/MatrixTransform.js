/** -*- compile-command: "jslint-cli Node.js" -*- */

/** 
 *  MatrixTransform is a Transform Node that can be customized with user matrix
 *  @class MatrixTransform
 */
osg.MatrixTransform = function() {
    osg.Transform.call(this);
    this.matrix = osg.Matrix.makeIdentity([]);
};

/** @lends osg.MatrixTransform.prototype */
osg.MatrixTransform.prototype = osg.objectLibraryClass(osg.objectInehrit(osg.Transform.prototype, {
    getMatrix: function(dirty) {
        if (dirty) this.dirtyMatrix();
        return this.matrix;
    },
    setMatrix: function(m) {
        this.matrix = m;
        this.dirtyMatrix();
    },
    computeLocalToWorldMatrix: function(matrix, nodeVisitor) {
        if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
            osg.Matrix.preMult(matrix, this.matrix);
        } else {
            matrix = this.matrix;
        }
        return true;
    },
    computeWorldToLocalMatrix: function(matrix, nodeVisitor) {
        var minverse = [];
        osg.Matrix.inverse(this.matrix, minverse);
        if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
            osg.Matrix.postMult(minverse, matrix);
        } else { // absolute
            matrix = inverse;
        }
        return true;
    }
}), "osg", "MatrixTransform");
osg.MatrixTransform.prototype.objectType = osg.objectType.generate("MatrixTransform");