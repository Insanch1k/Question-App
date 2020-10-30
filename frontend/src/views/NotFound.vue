<template>
  <div class="not-found">
    <div class="container mt-3">
      <h1>{{ message }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data(){
    return{
      message: "404 - Page Not Found"
    }
  }
}
</script>

<style scoped>
.not-found{
  color: red;
  text-align: center;
}
</style>