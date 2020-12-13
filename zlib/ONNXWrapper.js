sap.ui.define(['../libs/onnx.min'], () => {
  return async (model, config) => {
    const session = new onnx.InferenceSession({ backendHint: 'cpu' });
    await session.loadModel(config.modelUrl);
    const fnPropertyChangeHandler = _buildChangeHandler(model, config, session);
    model.attachEvent('propertyChange', fnPropertyChangeHandler);
  };

  function _buildChangeHandler(model, config, session) {
    return async oEvent => {
      const sChangedPath = oEvent.getParameter('path');
      const bInputChanged = config.inputMapping.some(
        mapping => mapping.path === sChangedPath
      );

      if (!bInputChanged) {
        return;
      }

      const values = await recalculateValues(model, config, session);

      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        model.setProperty(config.outputMapping[i].path, value, true);
      }
    };
  }

  async function recalculateValues(model, config, session) {
    const inputs = config.inputMapping.map(
      mapping => +model.getProperty(mapping.path)
    );
    const tensor = new onnx.Tensor(inputs, 'float32', [1, inputs.length]);
    const outputMap = await session.run([tensor]);
    return outputMap.values().next().value.data;
  }
});
