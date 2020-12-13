sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    '../zlib/ONNXWrapper'
  ],
  function (Controller, JSONModel, ONNXWrapper) {
    'use strict';

    return Controller.extend('demo.onnx.controller.App', {
      onInit: function () {
        this.oModel = new JSONModel({ cat1: '', cat2: '', target: '' });

        ONNXWrapper(this.oModel, {
          modelUrl: '/t.onnx',
          inputMapping: [{ path: '/cat1' }, { path: '/cat2' }],
          outputMapping: [{ path: '/target' }]
        });

        this.getView().setModel(this.oModel);
      }
    });
  }
);
