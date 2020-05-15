<template>
  <div id="app" class="h-100">
    
    <router-view/>
  </div>
</template>

<style lang="less">

  html, body {
    height: 100%;
  }
  body {
    padding: 0;
    margin: 0;
    overflow-y: auto;
  }
  ul, li {
    list-style: none;
  }
  input {
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
    background: transparent;
  }
  textarea {
    resize: none;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
  }

  // 自定义字体
  @font-face {
    font-family: 'iconfont';
    src: url('./assets/font/iconfont.eot');
    src: url('./assets/font/iconfont.eot?#iefix') format('embedded-opentype'),
        url('./assets/font/iconfont.woff2') format('woff2'),
        url('./assets/font/iconfont.woff') format('woff'),
        url('./assets/font/iconfont.ttf') format('truetype'),
        url('./assets/font/iconfont.svg#iconfont') format('svg');
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .h-100 {
    height: 100%;
  }
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .clearfix::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
  .auto-img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>
