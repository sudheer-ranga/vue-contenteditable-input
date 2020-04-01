<template>
  <component
    :is="tag"
    class="vue-editable-input"
    :class="{'disabled': !contenteditable}"
    :contenteditable="contenteditable"
    :ref="inputRef"
    :placeholder="placeholder"
    v-on="listeners"
  ></component>
</template>

<script>
function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement)
}

export default {
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
  data() {
    return {
      hasContent: false,
      isFocused: false,
      focusTimeoutRef: null
    };
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        focus: this.onFocus,
        blur: this.onBlur,
        keypress: this.handleEnter,
        paste: this.onPaste
      };
    }
  },
  mounted() {
    const inputRef = this.$refs[this.inputRef]
    inputRef.innerText = this.value || null
    this.$nextTick(() => {
      if (this.focus) {
        inputRef.focus()
      }
    })
    this.hasContent = this.value ? 'true' : 'false'
  },
  methods: {
    onBlur() {
      this.isFocused = false

      this.$emit('blur')
    },
    onInput(e) {
      const value = e.target.innerText
      this.hasContent = value ? 'true' : 'false'

      this.$emit('input', value)
    },
    onFocus(e) {
      this.isFocused = true
      const value = e.target.innerText
      this.hasContent = value ? 'true' : 'false'

      this.$emit('focus')
    },
    handleEnter(e) {
      if (e.key === 'Enter') {
        if (this.disableNewline) {
          e.preventDefault()
          this.$emit('enter', this.value)
        }
      }

      this.$emit('keypress')
    },
    onPaste(event) {
      event.preventDefault()
      let text = this.formatText
        ? event.clipboardData.getData('text/plain')
        : event.clipboardData.getData('text/html')

      if (this.disableNewline || this.formatText) {
        text = replaceAll(text, '\r\n', ' ')
        text = replaceAll(text, '\n', ' ')
        text = replaceAll(text, '\r', ' ')
      }

      this.formatText
        ? document.execCommand('inserttext', false, text)
        : document.execCommand('insertHTML', false, text)

      !this.formatText && this.$emit('input', text)
      this.$emit('paste')
    }
  }
};
</script>

<style scoped>
.vue-editable-input {
  min-width: 100px;
  display: inline-block;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  outline: none;
}

.vue-editable-input:focus {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

[placeholder]:empty:before {
  content: attr(placeholder);
  color: #676A6D;
}
</style>
