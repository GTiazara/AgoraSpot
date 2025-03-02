<template>
  <v-card class="pa-4">
    <v-card-title>Share "{{ eventName }}"</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="shareableLink"
        readonly
        append-inner-icon="mdi-content-copy"
        @click:append-inner="copyToClipboard"
        label="Shareable Link"
      ></v-text-field>

      <div class="d-flex justify-space-between">
        <v-btn color="primary" @click="shareOnSocialMedia('facebook')">
          <v-icon left>mdi-facebook</v-icon> Facebook
        </v-btn>
        <v-btn color="blue" @click="shareOnSocialMedia('twitter')">
          <v-icon left>mdi-twitter</v-icon> Twitter
        </v-btn>
        <v-btn color="green" @click="shareOnSocialMedia('whatsapp')">
          <v-icon left>mdi-whatsapp</v-icon> WhatsApp
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    eventName: {
      type: String,
      required: true,
    },
  },
  computed: {
    shareableLink() {
      const baseUrl = window.location.origin;
      return `${baseUrl}/event/${encodeURIComponent(this.eventName)}`;
    },
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.shareableLink);
      alert("Link copied to clipboard!");
    },
    shareOnSocialMedia(platform) {
      let url = "";
      switch (platform) {
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            this.shareableLink
          )}`;
          break;
        case "twitter":
          url = `https://twitter.com/intent/tweet?text=Check out this event: ${encodeURIComponent(
            this.shareableLink
          )}`;
          break;
        case "whatsapp":
          url = `https://api.whatsapp.com/send?text=Check out this event: ${encodeURIComponent(
            this.shareableLink
          )}`;
          break;
      }
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
.v-card {
  max-width: 400px;
}
</style>
