# vue-contenteditable-input

This plugin provides support for `contenteditable` element supporting `v-model`. It also provides some additional (optional) features like autofocus, placeholder, preventing html input / paste or new lines.

`vue-contenteditable-input` has full support of v-model reactivity.

# Should you use a content editable ?

The response is generally **NO**. But there are cases when neither `<input/>` nor `<textarea>` could suit your needs, for example when you need a dynamic object size to adapt to user input text size.

# Installation

With a build system

```sh
$ npm install --save vue-contenteditable-input
```

### In your `main.js`:

```javascript
import contenteditable from 'vue-contenteditable-input'
Vue.use(contenteditable)
```

### (Re)build
```
The required files are provided in `dist/` folder, but if you want to rebuild, simlply run :

npm run build
```

### Directely in html

```html
<script src="vue-contenteditable-input.min.js"></script>
```

### Usage

Where you need a `contenteditable` element :

```javascript
<template>
  <vue-contenteditable-editable tag="div" placeholder="Enter content" :contenteditable="isEditable" v-model="message" :disable-newline="true" @enter="enterPressed" :autofocus="true" />
</template>
 
<script>
export default {
  data() {
    return {
      isEditable: true,
      message: ''
    }
  },
  methods : {
    enterPressed(value) {
      alert('Enter Pressed with: ', value);
    }
  }
}
```

### Events
```
`enter`
  When the user press :kbd:Return and `disable-newline` is set, then it emits the `enter` event with the current value (as ``String``) as argument.
```

### License

This code is provided as-is, under the terms of the MIT license (see License file for more details).

A link to the original sources and contribution / pull request are welcome if you enjoy / use / contribute to this module ! :)


