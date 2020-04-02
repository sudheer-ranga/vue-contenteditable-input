import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support

export default {
  input: 'src/VueContenteditableInput.js', // Path relative to package.json
  output: {
    name: 'VueContenteditableInput',
    exports: 'named',
  },
  plugins: [
    commonjs(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    buble({
      objectAssign: "Object.assign"
    }), // Transpile to ES5
  ],
};
