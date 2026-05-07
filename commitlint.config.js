module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // nueva feature
        "fix", // bug fix
        "docs", // documentación
        "style", // formato (no cambia lógica)
        "refactor", // refactor sin cambio funcional
        "perf", // mejora de performance
        "test", // tests
        "chore", // mantenimiento, deps, configs
        "ci", // cambios en CI/CD
        "build", // build system
        "revert", // revertir commit
      ],
    ],
    "subject-case": [2, "never", ["upper-case", "pascal-case"]],
    "subject-max-length": [2, "always", 100],
  },
};
