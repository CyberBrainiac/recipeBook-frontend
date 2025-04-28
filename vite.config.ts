import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import crypto from "crypto";

import path from "path";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    base: env.VITE_BASE_URL || "./",
    server: {
      port: parseInt(env.VITE_APP_PORT || "4201"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
        "@pages": path.resolve(__dirname, "./src/pages/"),
        "@ui": path.resolve(__dirname, "./src/ui/"),
        "@redux": path.resolve(__dirname, "./src/redux/"),
        "@hooks": path.resolve(__dirname, "./src/hooks/"),
        "@utils": path.resolve(__dirname, "./src/utils/"),
        "@axios": path.resolve(__dirname, "src/axios/"),
        "@img": path.resolve(__dirname, "src/assets/img/"),
        "@style": path.resolve(__dirname, "src/assets/style/"),
        "@interfaces": path.resolve(__dirname, "src/interfaces/"),
      },
    },
    plugins: [react()],
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
      modules: {
        localsConvention: "camelCase",
        generateScopedName: (name, filename, css) => {
          const componentName = filename.slice(
            filename.lastIndexOf("/") + 1,
            filename.indexOf(".")
          );
          const hash = crypto.createHash("md5").update(css).digest("base64url").substring(0, 2);
          return `${componentName}__${name}-${hash}${numberInRange(10, 100)}`;
        },
      },
    },
  });

  function numberInRange(start: number, end: number) {
    const range = end - start;
    if (range <= 0) {
      throw new Error('randNumberInRange error: "end" <= "start", range = '.concat(`${range}`));
    }
    return Math.floor(Math.random() * (range + 1)) + start;
  }
};
