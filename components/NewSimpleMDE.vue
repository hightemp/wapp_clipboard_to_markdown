<template>
  <div :class="sClass">
    <textarea 
      ref="new_simple_mde"
    ></textarea>
  </div>
</template>

<script>

// import fnPrepareSimpleMDE from '../lib/editor'
import '../lib/simplemde-markdown-editor/src/css/simplemde.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'codemirror/lib/codemirror.css'

import 'codemirror/theme/monokai.css';

import { fnPrepareSimpleMDE, fnPrepareCodeMirrorfromTextArea } from '../lib/editor'

export default {
  props: [
    'sClass'
  ],

  // data() { return {
  //   sClass: this.class
  // } },

  created() 
  {

  },

  mounted()
  {
    fnPrepareSimpleMDE.bind(this)(this.$refs.new_simple_mde);
    // fnPrepareCodeMirrorfromTextArea.bind(this)(this.$refs.new_simple_mde);
    this.codemirror.setOption("theme", 'monokai');
  }
}
</script>

<style>
.CodeMirror {
    height: calc(100vh - 110px);
    min-height: calc(100vh - 110px) !important;
    font-family: monospace;
}

/* .replacement-open .CodeMirror {
    height: calc(100% - 428px);
}

.translation-open .CodeMirror {
    height: calc(100% - 428px);
} */

/* .CodeMirror-vscrollbar {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 18px;
} */
.CodeMirror-vscrollbar {
  right: 20px;
  top: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>