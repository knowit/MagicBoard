module.exports = {
  generateModules: function(config) {
    const modules = [];
    modules.push(config.modules.topBar);

    for (let m in config.modules.misc) {
      let module = config.modules.misc[m];
      if (modules.indexOf(module.module) === -1 && !module.disabled) {
        modules.push(module);
      }
    }

    for (let m in config.modules.upperLeft) {
      let module = config.module.upperLeft[m];
      if (modules.indexOf(module.module) === -1 && !module.disabled) {
        modules.push(module);
      }
    }

    for (let m in config.modules.upperRight) {
      let module = config.modules.upperRight[m];
      if (modules.indexOf(module.module) === -1 && !module.disabled) {
        modules.push(module);
      }
    }

    for (let m in config.modules.lowerLeft) {
      let module = config.modules.lowerLeft[m];
      if (modules.indexOf(module.module) === -1 && !module.disabled) {
        modules.push(module);
      }
    }

    for (let m in config.modules.lowerRight) {
      let module = config.modules.lowerRight[m];
      if (modules.indexOf(module.module) === -1 && !module.disabled) {
        modules.push(module);
      }
    }

    return modules;
  },
};
