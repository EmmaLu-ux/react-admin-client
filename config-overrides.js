const {override, fixBabelImports, addLessLoader} = require('customize-cra')
module.exports = override(
  //针对antd实现按需打包：根据import来打包（使用babel-plugin-import）
	fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true //自动打包相关的样式
  }),
  //使用less-loader对源码中的less的变量进行重新指定（覆盖）
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#5157f7',
      "@link-color": "#5157f7",
      '@heading-color': 'black',
      '@text-color': 'black',
      '@border-radius-base': '5px'
    }
  })
)