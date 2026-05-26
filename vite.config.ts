import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  let repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/';
  if (process.env.BUILD_TARGET === 'android') {
    repoName = '/'; // For Capacitor, base must be root
  }
  
  const rawAiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
  // Простая обфускация ключа на этапе сборки, чтобы он не лежал в открытом виде (Base64 + реверс)
  const obfuscatedAiKey = Buffer.from(rawAiKey).toString('base64').split('').reverse().join('');
  
  const rawHfKey = process.env.HF_API_KEY || env.HF_API_KEY || '';
  const obfuscatedHfKey = Buffer.from(rawHfKey).toString('base64').split('').reverse().join('');
  
  const supabaseUrl = process.env.SUPABASE_URL || env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';
  
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME || '';
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY || '';
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || env.CLOUDINARY_API_SECRET || '';
  
  return {
    base: repoName,
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY_OBFUSCATED': JSON.stringify(obfuscatedAiKey),
      'process.env.HF_API_KEY_OBFUSCATED': JSON.stringify(obfuscatedHfKey),
      'process.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'process.env.CLOUDINARY_CLOUD_NAME': JSON.stringify(cloudinaryCloudName),
      'process.env.CLOUDINARY_API_KEY': JSON.stringify(cloudinaryApiKey),
      'process.env.CLOUDINARY_API_SECRET': JSON.stringify(cloudinaryApiSecret),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
