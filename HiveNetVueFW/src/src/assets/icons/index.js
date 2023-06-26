/**
 * 针对 svg-sprite-loader 实现的icons加载代码
 */
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
