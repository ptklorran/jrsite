<template>
  <div>
    <v-app dark class="elevation-0">
      <v-content class="">
        <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
