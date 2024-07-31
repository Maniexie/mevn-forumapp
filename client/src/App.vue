<template>
  <h1>tes 123</h1>
  {{ dataMessage.message }}
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const dataMessage = ref("");

const getMessage = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/");
    dataMessage.value = data;
    // console.log(response);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getMessage();
});
</script>
