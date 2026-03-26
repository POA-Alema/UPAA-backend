// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos
    'type-enum': [
      2,
      'always',
      [
        'feat',     // nova feature
        'fix',      // correção de bug
        'docs',     // documentação
        'style',    // formatação (sem mudança de lógica)
        'refactor', // refatoração
        'test',     // testes
        'chore',    // tarefas de build, configs
        'perf',     // melhoria de performance
        'ci',       // mudanças de CI
        'revert',   // revert de commit
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};

// Exemplos de commits válidos:
// feat: add user authentication endpoint
// fix(auth): handle expired jwt token
// docs: update swagger annotations for orders module
// chore: bump nestjs to v11