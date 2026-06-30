import next from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "docs/**"] },
  ...next,
];

export default eslintConfig;
