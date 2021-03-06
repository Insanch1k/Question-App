<template>
  <div class="single-question mt-2">
    <div v-if="question" class="container">
      <h1>{{ question.content }}</h1>
      <QuestionActions
          v-if="isQuestionAuthor"
          :slug="question.slug">
      </QuestionActions>
      <p class="mb-0">Posted by:
        <span class="author-name">{{ question.author }}</span>
      </p>
      <p> {{ question.created_at }}</p>
      <hr>
      <div v-if="userHasAnswered">
        <p class="answer-added">You have written answer!</p>
      </div>
      <div v-else-if="showForm">
        <form class="card" @submit.prevent="onSubmit">
          <div class="card-header px-3">
            Answer the Question
          </div>
          <div class="card-block">
            <textarea
                v-model="newAnswerBody"
                class="form-control"
                placeholder="Answer the Question"
                rows="5">
            </textarea>
          </div>
          <div class="card-footer px-3">
            <button class="btn btn-sm btn-success" type="submit">
              Submit Your Answer
            </button>
          </div>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
      <div v-else>
        <button class="btn btn-sm btn-success"
                @click="showForm = true"
        >Answer the Question
        </button>
      </div>
      <hr>
    </div>
    <div v-else>
      <h1 class="not-found">404 - Question Not Found</h1>
    </div>
    <div v-if="question" class="container">
      <AnswerComponent v-for="answer in answers"
                       :key="answer.id"
                       :answer="answer"
                       :requestUser="requestUser"
                       @delete-answer="deleteAnswer">
      </AnswerComponent>
    </div>
    <div class="my-4 container">
      <p v-show="loadingAnswers">loading...</p>
      <button
          v-show="next"
          @click="getQuestionAnswers"
          class="btn btn-sm btn-outline-success">
        Load More
      </button>
    </div>
  </div>
</template>

<script>
import {apiService} from "@/common/api.service";
import AnswerComponent from "@/components/Answer.vue";
import QuestionActions from "@/components/QuestionActions";

export default {
  name: "Question",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  components: {
    QuestionActions,
    AnswerComponent
  },
  data() {
    return {
      question: {},
      answers: [],
      newAnswerBody: null,
      error: null,
      userHasAnswered: false,
      showForm: false,
      next: null,
      loadingAnswers: false,
      requestUser: null
    }
  },
  methods: {
    getQuestionData() {
      let endpoint = `/api/questions/${this.slug}/`;
      apiService(endpoint)
          .then(data => {
            if (data) {
              this.question = data;
              this.userHasAnswered = data.user_has_answered;
              this.setPageTitle(data.content)
            } else {
              this.question = null;
              this.setPageTitle("404 - Page Not Found")
            }
          })
    },
    setRequestUser() {
      this.requestUser = window.localStorage.getItem("username");
    },
    setPageTitle(title) {
      document.title = title;
    },
    getQuestionAnswers() {
      let endpoint = `/api/questions/${this.slug}/answers/`;
      if (this.next) {
        endpoint = this.next;
      }
      this.loadingAnswers = true;
      apiService(endpoint)
          .then(data => {
            this.answers.push(...data.results);
            this.loadingAnswers = false;
            if (data.next) {
              this.next = data.next;
            } else {
              this.next = null;
            }
          })
    },
    onSubmit() {
      if (this.newAnswerBody) {
        let endpoint = `/api/questions/${this.slug}/answer/`;
        apiService(endpoint, "POST", {body: this.newAnswerBody})
            .then(data => {
              this.answers.unshift(data)
            })
        this.newAnswerBody = null;
        this.showForm = false;
        this.userHasAnswered = true;
        if (this.error) {
          this.error = null;
        }
      } else {
        this.error = "You cant send a empty answer!";
      }
    },
    async deleteAnswer(answer) {
      let endpoint = `/api/answers/${answer.id}/`;
      try {
        await apiService(endpoint, "DELETE");
        this.$delete(this.answers, this.answers.indexOf(answer));
        this.userHasAnswered = false;
      } catch (err) {
        console.log(err);
      }
    }
  },
  computed: {
    isQuestionAuthor() {
      return this.question.author === this.requestUser;
    }
  },
  created() {
    this.getQuestionData()
    this.getQuestionAnswers()
    this.setRequestUser()
  }
}
</script>

<style scoped>
.author-name {
  font-weight: bold;
  color: red;
}

.answer-added {
  font-weight: bold;
  color: green;
}

.error {
  font-weight: bold;
  color: red;
}

.not-found{
  color: red;
  text-align: center;
}
</style>