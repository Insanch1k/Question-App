<template>
  <div class="container mt-2">
    <h2 class="mb-3">Edit Your Answer</h2>
    <form @submit.prevent="onSubmit">
      <textarea
          v-model="answerBody"
          class="form-control"
          rows="3">
      </textarea>
      <br>
      <button
          type="submit"
          class="btn btn-success">
        Publish your answer
      </button>
    </form>
    <p v-if="error" class="muted mt-2">{{ error }}</p>
  </div>
</template>

<script>
import {apiService} from "@/common/api.service";

export default {
  name: "AnswerEditor",
  props: {
    id: {
      type: Number,
      required: true,
    }
  },
  data(){
    return {
      previousAnswer: null,
      questionSlug: null,
      answerBody: this.previousAnswer,
      error: null
    }
  },
  methods: {
    onSubmit(){
      if(this.answerBody){
        let endpoint = `/api/answers/${this.id}/`;
        apiService(endpoint, "PUT",{body: this.answerBody})
        .then(() => {
          this.$router.push({
            name: "question",
            params: {slug: this.questionSlug }
          })
        })
      } else {
        this.error = "You cant submit an empty answer";
      }
    }
  },
  async beforeRouteEnter(to, from, next) {
    let endpoint = `/api/answers/${to.params.id}/`;
    let data = await apiService(endpoint);
    return next(vm => {
      vm.answerBody = data.body;
      vm.questionSlug = data.question_slug;
    });
  }
}
</script>

<style scoped>

</style>