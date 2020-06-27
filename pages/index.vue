<template>
  <div id="root-wrapper">
    <NewSimpleMde
      sClass="editor"
    ></NewSimpleMde>
    <!--iframe 
      id="preview"
      src=""
    ></iframe-->
  </div>
</template>

<script>

import NewSimpleMde from '../components/NewSimpleMDE'

export default {
  components: {
    NewSimpleMde
  },

}
</script>

<style>
html, body {
  margin: 0px;
  padding: 0px;
  height: 100%;
}
#root-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  height: 100vh;
}
#root-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
