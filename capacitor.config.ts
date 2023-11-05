import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.thera.pontoeletronico',
  appName: 'Ponto Eletrônico',
  webDir: 'www',

  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorHttp: {
      enabled: false,
    },
  },
};

export default config;
