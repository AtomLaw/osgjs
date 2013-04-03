/**
 * Camera - is a subclass of Transform which represents encapsulates the settings of a Camera.
 * @class Camera
 * @inherits osg.Transform osg.CullSettings
 */
osg.Camera = function() {
    osg.Transform.call(this);
    osg.CullSettings.call(this);

    this.viewport = undefined;
    this.setClearColor([0, 0, 0, 1.0]);
    this.setClearDepth(1.0);
    this.setClearMask(osg.Camera.COLOR_BUFFER_BIT | osg.Camera.DEPTH_BUFFER_BIT);

    this.modelMatrix = osg.Matrix.makeIdentity([]);
    this.setViewMatrix(osg.Matrix.makeIdentity([]));
    this.setProjectionMatrix(osg.Matrix.makeIdentity([]));

    this.renderOrder = osg.Camera.NESTED_RENDER;
    this.renderOrderNum = 0;
};

osg.Camera.PRE_RENDER = 0;
osg.Camera.NESTED_RENDER = 1;
osg.Camera.POST_RENDER = 2;

osg.Camera.COLOR_BUFFER_BIT = 0x00004000;
osg.Camera.DEPTH_BUFFER_BIT = 0x00000100;
osg.Camera.STENCIL_BUFFER_BIT = 0x00000400;

/** @lends osg.Camera.prototype */
osg.Camera.prototype = osg.objectLibraryClass(osg.objectInehrit(
osg.objectInehrit(osg.CullSettings.prototype,
osg.objectInehrit(osg.Transform.prototype, {

    setClearDepth: function(depth) {
        this.clearDepth = depth;
    },
    getClearDepth: function() {
        return this.clearDepth;
    },

    setClearMask: function(mask) {
        this.clearMask = mask;
    },
    getClearMask: function() {
        return this.clearMask;
    },

    setClearColor: function(color) {
        this.clearColor = color;
    },
    getClearColor: function() {
        return this.clearColor;
    },

    setTraversalMask: function(traversalMask) {
        this.traversalMask = traversalMask;
    },
    getTraversalMask: function() {
        return this.traversalMask;
    },

    setViewport: function(vp) {
        this.viewport = vp;
        this.getOrCreateStateSet().setAttributeAndMode(vp);
    },
    getViewport: function() {
        return this.viewport;
    },

    setViewMatrix: function(matrix) {
        //if (osg.oldModelViewMatrixMode) {
            this.modelviewMatrix = matrix;
        //} else {
            this.viewMatrix = matrix;
            osg.Matrix.inverse(matrix, this.modelMatrix);
        //}
    },
    getViewMatrix: function(dirty) {
        //if (osg.oldModelViewMatrixMode) {
        //    return this.modelviewMatrix;
        //} else {
            if (dirty) this.dirtyMatrix();
            return this.viewMatrix;
        //}
    },

    setProjectionMatrix: function(matrix) {
        this.projectionMatrix = matrix;
    },

    /** Set to an orthographic projection. See OpenGL glOrtho for documentation further details.*/
    setProjectionMatrixAsOrtho: function(left, right,
    bottom, top,
    zNear, zFar) {
        osg.Matrix.makeOrtho(left, right, bottom, top, zNear, zFar, this.getProjectionMatrix());
    },

    getProjectionMatrix: function() {
        return this.projectionMatrix;
    },
    getRenderOrder: function() {
        return this.renderOrder;
    },
    setRenderOrder: function(order, orderNum) {
        this.renderOrder = order;
        this.renderOrderNum = orderNum;
    },

    attachTexture: function(bufferComponent, texture, level) {
        if (this.frameBufferObject) {
            this.frameBufferObject.dirty();
        }
        if (level === undefined) {
            level = 0;
        }
        if (this.attachments === undefined) {
            this.attachments = {};
        }
        if (bufferComponent == osg.FrameBufferObject.COLOR_ATTACHMENT0) {
            osgUtil.ressourcesCache.frameBufferObjectTarget.push(texture);
        }

        this.attachments[bufferComponent] = {
            'texture': texture,
            'level': level
        };
    },

    attachRenderBuffer: function(bufferComponent, internalFormat) {
        if (this.frameBufferObject) {
            this.frameBufferObject.dirty();
        }
        if (this.attachments === undefined) {
            this.attachments = {};
        }
        this.attachments[bufferComponent] = {
            'format': internalFormat
        };
    },

    computeLocalToWorldMatrix: function(matrix, nodeVisitor) {
        if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
            osg.Matrix.preMult(matrix, this.modelMatrix);
        } else { // absolute
            matrix = this.modelMatrix;
        }
        return true;
    },

    computeWorldToLocalMatrix: function(matrix, nodeVisitor) {
        var inverse = [];
        osg.Matrix.inverse(this.modelMatrix, inverse);
        if (this.referenceFrame === osg.Transform.RELATIVE_RF) {
            osg.Matrix.postMult(inverse, matrix);
        } else {
            matrix = inverse;
        }
        return true;
    }

}))), "osg", "Camera");
osg.Camera.prototype.objectType = osg.objectType.generate("Camera");