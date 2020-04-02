//
//
//
//
//
//
//
//
//
//
//
//

function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement)
}

var script = {
  name: 'VueContenteditableInput',
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    contenteditable: {
      type: Boolean,
      default: true
    },
    inputRef: {
      type: String,
      default: 'editable-input'
    },
    value: {
      type: String,
      default: ''
    },
    icon: null,
    placeholder: {
      type: String
    },
    focus: {
      type: Boolean
    },
    disableNewline: {
      type: Boolean,
      default: false
    },
    formatText: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      hasContent: false,
      isFocused: false,
      focusTimeoutRef: null
    };
  },
  computed: {
    listeners: function listeners() {
      return Object.assign({}, this.$listeners,
        {input: this.onInput,
        focus: this.onFocus,
        blur: this.onBlur,
        keypress: this.handleEnter,
        paste: this.onPaste});
    }
  },
  mounted: function mounted() {
    var this$1 = this;

    var inputRef = this.$refs[this.inputRef];
    inputRef.innerText = this.value || null;
    this.$nextTick(function () {
      if (this$1.focus) {
        inputRef.focus();
      }
    });
    this.hasContent = this.value ? 'true' : 'false';
  },
  methods: {
    onBlur: function onBlur() {
      this.isFocused = false;

      this.$emit('blur');
    },
    onInput: function onInput(e) {
      var value = e.target.innerText;
      this.hasContent = value ? 'true' : 'false';

      this.$emit('input', value);
    },
    onFocus: function onFocus(e) {
      this.isFocused = true;
      var value = e.target.innerText;
      this.hasContent = value ? 'true' : 'false';

      this.$emit('focus');
    },
    handleEnter: function handleEnter(e) {
      if (e.key === 'Enter') {
        if (this.disableNewline) {
          e.preventDefault();
          this.$emit('enter', this.value);
        }
      }

      this.$emit('keypress');
    },
    onPaste: function onPaste(event) {
      event.preventDefault();
      var text = this.formatText
        ? event.clipboardData.getData('text/plain')
        : event.clipboardData.getData('text/html');

      if (this.disableNewline || this.formatText) {
        text = replaceAll(text, '\r\n', ' ');
        text = replaceAll(text, '\n', ' ');
        text = replaceAll(text, '\r', ' ');
      }

      this.formatText
        ? document.execCommand('inserttext', false, text)
        : document.execCommand('insertHTML', false, text);

      !this.formatText && this.$emit('input', text);
      this.$emit('paste');
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    _vm.tag,
    _vm._g(
      {
        ref: _vm.inputRef,
        tag: "component",
        staticClass: "vue-editable-input",
        class: { disabled: !_vm.contenteditable },
        attrs: {
          contenteditable: _vm.contenteditable,
          placeholder: _vm.placeholder
        }
      },
      _vm.listeners
    )
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-681f7669_0", { source: "\n.vue-editable-input[data-v-681f7669] {\n  min-width: 100px;\n  display: inline-block;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  padding: 10px;\n  outline: none;\n}\n.vue-editable-input[data-v-681f7669]:focus {\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);\n}\n[placeholder][data-v-681f7669]:empty:before {\n  content: attr(placeholder);\n  color: #676A6D;\n}\n", map: {"version":3,"sources":["/Users/ranga/demos/vue-contenteditable-input/src/VueContenteditableInput.vue"],"names":[],"mappings":";AAsIA;EACA,gBAAA;EACA,qBAAA;EACA,sBAAA;EACA,kBAAA;EACA,aAAA;EACA,aAAA;AACA;AAEA;EACA,sCAAA;AACA;AAEA;EACA,0BAAA;EACA,cAAA;AACA","file":"VueContenteditableInput.vue","sourcesContent":["<template>\n  <component\n    :is=\"tag\"\n    class=\"vue-editable-input\"\n    :class=\"{'disabled': !contenteditable}\"\n    :contenteditable=\"contenteditable\"\n    :ref=\"inputRef\"\n    :placeholder=\"placeholder\"\n    v-on=\"listeners\"\n  ></component>\n</template>\n\n<script>\nfunction replaceAll(str, search, replacement) {\n  return str.split(search).join(replacement)\n}\n\nexport default {\n  name: 'VueContenteditableInput',\n  props: {\n    tag: {\n      type: String,\n      default: 'span'\n    },\n    contenteditable: {\n      type: Boolean,\n      default: true\n    },\n    inputRef: {\n      type: String,\n      default: 'editable-input'\n    },\n    value: {\n      type: String,\n      default: ''\n    },\n    icon: null,\n    placeholder: {\n      type: String\n    },\n    focus: {\n      type: Boolean\n    },\n    disableNewline: {\n      type: Boolean,\n      default: false\n    },\n    formatText: {\n      type: Boolean,\n      default: false\n    }\n  },\n  data() {\n    return {\n      hasContent: false,\n      isFocused: false,\n      focusTimeoutRef: null\n    };\n  },\n  computed: {\n    listeners() {\n      return {\n        ...this.$listeners,\n        input: this.onInput,\n        focus: this.onFocus,\n        blur: this.onBlur,\n        keypress: this.handleEnter,\n        paste: this.onPaste\n      };\n    }\n  },\n  mounted() {\n    const inputRef = this.$refs[this.inputRef]\n    inputRef.innerText = this.value || null\n    this.$nextTick(() => {\n      if (this.focus) {\n        inputRef.focus()\n      }\n    })\n    this.hasContent = this.value ? 'true' : 'false'\n  },\n  methods: {\n    onBlur() {\n      this.isFocused = false\n\n      this.$emit('blur')\n    },\n    onInput(e) {\n      const value = e.target.innerText\n      this.hasContent = value ? 'true' : 'false'\n\n      this.$emit('input', value)\n    },\n    onFocus(e) {\n      this.isFocused = true\n      const value = e.target.innerText\n      this.hasContent = value ? 'true' : 'false'\n\n      this.$emit('focus')\n    },\n    handleEnter(e) {\n      if (e.key === 'Enter') {\n        if (this.disableNewline) {\n          e.preventDefault()\n          this.$emit('enter', this.value)\n        }\n      }\n\n      this.$emit('keypress')\n    },\n    onPaste(event) {\n      event.preventDefault()\n      let text = this.formatText\n        ? event.clipboardData.getData('text/plain')\n        : event.clipboardData.getData('text/html')\n\n      if (this.disableNewline || this.formatText) {\n        text = replaceAll(text, '\\r\\n', ' ')\n        text = replaceAll(text, '\\n', ' ')\n        text = replaceAll(text, '\\r', ' ')\n      }\n\n      this.formatText\n        ? document.execCommand('inserttext', false, text)\n        : document.execCommand('insertHTML', false, text)\n\n      !this.formatText && this.$emit('input', text)\n      this.$emit('paste')\n    }\n  }\n};\n</script>\n\n<style scoped>\n.vue-editable-input {\n  min-width: 100px;\n  display: inline-block;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  padding: 10px;\n  outline: none;\n}\n\n.vue-editable-input:focus {\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);\n}\n\n[placeholder]:empty:before {\n  content: attr(placeholder);\n  color: #676A6D;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-681f7669";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

var VueContenteditableInput = { 
  install: function install (Vue) {
    Vue.component(__vue_component__.name, __vue_component__);
  }
};

// let GlobalVue = null;
// if (typeof window !== 'undefined') {
//   GlobalVue = window.Vue;
// } else if (typeof global !== 'undefined') {
//   GlobalVue = global.Vue;
// }
// if (GlobalVue) {
//   GlobalVue.use(Component);
// }

if (typeof window !== 'undefined' && window.Vue) {
  console.log('adding to global vue');
  window.Vue.use(__vue_component__);
}

export default VueContenteditableInput;
