# Motor Studio

Editor nativo para Windows da engine [motor](https://github.com/kyanthx-dv/motor). Esta versão não embrulha o editor web antigo: ela possui uma interface própria inspirada no fluxo do Godot e do Phaser Editor.

## O que existe na versão 0.2.0

- Tela inicial de escolha e criação de projeto.
- Projetos recentes persistidos localmente.
- Configurações com temas Midnight, Light e Ember.
- Layout de editor com docks: árvore de cena, arquivos, canvas, inspetor e saída.
- Canvas próprio para visualizar e editar objetos básicos da cena.
- Inspetor para nome, posição, rotação, forma, cor e dimensões.
- Editor de código Monaco com abas e destaque de sintaxe JavaScript.
- Um único fluxo nativo de abrir/salvar projeto JSON.
- Menus nativos conectados ao projeto atual.
- Engine original mantida separada como submódulo Git em `motor/`.

## Desenvolvimento

```bash
git clone --recurse-submodules https://github.com/kah0094/EngineMotorBase.git
npm install
npm start
```

## Gerar o pacote Windows

No Linux ou Windows, gere a pasta distribuível x64 com:

```bash
npm run dist:win
```

O executável fica em `release/win-unpacked/Motor Studio.exe`. O Windows precisa de toda essa pasta, não apenas do `.exe`, porque ela contém `resources`, DLLs e o runtime Electron. Para criar um arquivo publicável:

```bash
cd release
zip -qr Motor-Studio-Windows-x64.zip win-unpacked
```

## Publicar o primeiro release no GitHub

Depois de fazer o build, publique o pacote com o GitHub CLI:

```bash
gh auth status
gh release create v0.2.0 \
  release/Motor-Studio-Windows-x64.zip \
  --repo kah0094/EngineMotorBase \
  --title "Motor Studio 0.2.0" \
  --notes "Primeiro release do editor nativo Windows. Extraia o ZIP e execute Motor Studio.exe dentro da pasta win-unpacked."
```

Para uma versão futura, aumente a versão no `package.json`, faça commit, gere o novo ZIP e troque `v0.2.0` pela nova tag. Não publique o `.exe` isolado: publique o ZIP completo.
