# Motor Editor

Aplicativo desktop nativo para Windows baseado na engine [motor](https://github.com/kyanthx-dv/motor). Este repositório é separado e não altera o repositório-base: a engine é referenciada como submódulo Git em `motor/`.

## Funcionalidades da primeira versão

- Editor visual existente da engine empacotado em uma janela Electron nativa.
- Abrir, salvar e salvar como usando diálogos nativos.
- Menus de Arquivo, Editar, Exibir e Ajuda.
- Atalhos `Ctrl+O`, `Ctrl+S`, `Ctrl+Shift+S`, `Ctrl+Z`, `Ctrl+Y` e `F11`.
- Seleção, arraste, redimensionamento, rotação, zoom por roda e pan com Espaço + arraste.
- Visual desktop escuro com barra de ações e feedback de salvamento.
- Build automatizado do instalador NSIS e versão portátil `.exe`.

## Desenvolvimento

```bash
git clone --recurse-submodules https://github.com/kyanthx-dv/Motor-Engine.git
npm install
npm start
```

Para gerar o instalador no Windows:

```bash
npm run dist:win
```

Os artefatos aparecem em `release/`. O workflow do GitHub Actions também gera os executáveis em cada push para `main`.

## Separação do projeto-base

O repositório `kyanthx-dv/motor` permanece independente. Para atualizar a versão usada pelo editor, faça a atualização do submódulo neste repositório:

```bash
git -C motor fetch origin
git -C motor checkout main
git -C motor pull --ff-only
git add motor
git commit -m "chore: atualizar engine motor"
```
