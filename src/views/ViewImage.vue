<template>
  <div class="container">
    <div>
      <h2>Picture Viewer</h2>
      <div class="image" v-bind:key="photo._id">
        <img :src="photo.path">
        <p class="photoTitle">{{photo.title}}</p>
        <p class="photoDate">
          <span v-if="user">{{user.name}},</span>
          {{formatDate(photo.created)}}
        </p>
        <p>{{photo.description}}</p>
        <div class="spacer"></div>
        <form @submit.prevent="upload" class="pure-form pure-form-aligned" v-if="user">
          <fieldset>
            <div class="pure-control-group">
              <textarea v-model="comment" placeholder="Enter your comment here" rows="4" cols="30"></textarea>
            </div>
            <div class="pure-controls">
              <button type="submit" class="pure-button pure-button-primary">Submit</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
    <div class="comments">
      <div class="list-item" v-for="comment of comments" v-bind:key="comment.id">
        <div class="review-header">
          <b>{{comment.userName}}:</b>
        </div>
        <div>
          <p class="date">{{formatDate(comment.date)}}</p>
          <p class="comment-body">{{comment.comment}}</p>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.container {
  display: flex;
  flex-direction: "row";
}

.comments {
  margin-left: 45px;
}

.date {
  font-size: 12px;
  margin-left: 15px;
}

.list-item {
  min-width: 300px;
  padding: 5px 10px 5px 10px;
  display: flex;
  margin-bottom: 30px;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ebebeb;
  border-radius: 10px;
}

.comment-body {
  margin: 10px 0px 0px 15px;
}

.photoTitle {
  margin: 0px;
  font-size: 1.2em;
}

.photoDate {
  margin: 0px;
  font-size: 0.9em;
  font-weight: normal;
}

p {
  margin: 0px;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  max-width: 600px;
  max-height: 600px;
  image-orientation: from-image;
}
</style>



<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "viewImage",
  async created() {
    await this.$store.dispatch("getOnePhoto", this.$route.params.id);
    await this.$store.dispatch("getPhotoComments", this.$route.params.id);
  },
  computed: {
    photo() {
      return this.$store.state.photo;
    },
    user() {
      return this.$store.state.user;
    },
    comments() {
      return this.$store.state.comments;
    }
  },
  data() {
    return {
      comment: ""
    };
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },
    async upload() {
      try {
        let commentObj = {
          photo: this.photo._id,
          comment: this.comment,
          user: this.user.name,
          date: new Date()
        };
        this.$store.commit('localAddComment', commentObj);
        await this.$store.dispatch("addComment", commentObj);
      } catch (error) {
        console.log(error);
      }
    },
    async getOnePhoto(id) {
      try {
        let response = await axios.get("/api/photos/" + id);
        return response;
      } catch (error) {
        return "";
      }
    }
  }
};
</script>