import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'agoraspot',
  webDir: 'dist',
  server: {
    url: "https://agora-spot-app.vercel.app/", // Your Vercel app URL
    cleartext: false
  }
};

export default config;
