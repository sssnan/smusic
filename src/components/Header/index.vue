<template>
  <header>
    <div class="header">
      <router-link :to="{ path: '/' }"><img class="logo pointer" src="@/assets/images/logo.png" /></router-link>
      <Nav></Nav>
      <Search></Search>
    </div>
  </header>
</template>
<script>
import Nav from "./Nav";
import Search from "./Search";
export default {
  name: "Header",
  components: { Nav, Search },
};
</script>
<style lang="less">
header {
  background: #6190e8; /* fallback for old browsers */
  background: -webkit-linear-gradient(75deg, rgb(107, 159, 255), rgb(183, 209, 255)); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(75deg, rgb(111, 200, 255), rgb(167, 191, 232)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1228px;
  height: 70px;
  margin: 0 auto;
  border-bottom: 1px solid #fff;
  .logo {
    opacity: 0.7;
    width: 250px;
    height: 70px;
  }
}
</style>
