import { defineConfig, loadEnv } from "vite";
import { extensions, classicEmberSupport, ember } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      allowedHosts: env.ALLOWED_HOSTS ? env.ALLOWED_HOSTS.split(",") : [],
    },
    plugins: [
      classicEmberSupport(),
      ember(),
      babel({ babelHelpers: "runtime", extensions }),
    ],
  };
});
