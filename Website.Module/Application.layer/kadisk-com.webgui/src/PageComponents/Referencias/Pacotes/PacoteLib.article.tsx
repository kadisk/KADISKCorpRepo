import * as React from "react"

const PacoteLibArticle = () => {
  return (
    <div className="container-xl">
      <div className="row">
        <div className="col">
          <h1>Pacote tipo Lib (Biblioteca)</h1>
          <p>
            O pacote do tipo Lib é o modelo mais simples disponível no ecossistema.
            Para que seja encontrado por outros pacotes, é necessário criar o arquivo de metadados 
            <code>metadata/package.json</code> com as propriedades obrigatórias, conforme descrito na <a href="#/documentation?articleUri=3.0">Referência de Metadados Package</a>.
          </p>
          
          <h2>Exemplo de package.json para um pacote lib</h2>
          <pre>
{`{
  "namespace": "@/nova-biblioteca.lib"
}`}
          </pre>
          
          <h2>Guia Prático: Criando sua Primeira Biblioteca</h2>
          <p>
            Siga estes passos para criar sua primeira biblioteca com o nome <code>minha-biblioteca.lib</code>:
          </p>
          
          <h3>Passo 1: Criar a estrutura de diretórios</h3>
          <p>
            Crie a seguinte estrutura de pastas em seu projeto:
          </p>
          <pre>
{`minha-biblioteca.lib/
├── metadata
│   └── package.json
├── package.json
└── src
    └── SomeFunction.js`}
          </pre>
          
          <h3>Passo 2: Configurar o package.json principal</h3>
          <p>
            No arquivo <code>package.json</code> na raiz do projeto, adicione as informações básicas do pacote:
          </p>
          <pre>
{`{
  "name": "minha-biblioteca.lib",
  "version": "1.0.0",
  "description": "Minha primeira biblioteca de exemplo",
  "license": "ISC",
  "author": "Seu Nome"
}`}
          </pre>
          <p>
            <strong>Nota:</strong> Este é um package.json padrão do Node.js. Em futuras atualizações do ecossistema, 
            estas informações serão incorporadas ao metadata/package.json, unificando a configuração.
          </p>
          
          <h3>Passo 3: Configurar o metadata/package.json</h3>
          <p>
            Crie o arquivo <code>metadata/package.json</code> com o seguinte conteúdo:
          </p>
          <pre>
{`{
  "namespace": "@/minha-biblioteca.lib"
}`}
          </pre>
          <p>
            O <strong>namespace</strong> é um identificador único que permite que outros pacotes possam referenciar 
            e utilizar sua biblioteca. O prefixo <code>@/</code> indica que é um pacote local ao projeto.
          </p>
          
          <h3>Passo 4: Implementar sua função</h3>
          <p>
            Crie o arquivo <code>src/SomeFunction.js</code> com uma função simples para teste:
          </p>
          <pre>
{`const SomeFunction = () => {
    console.log("Hi!")
}

module.exports = SomeFunction`}
          </pre>
          <p>
            Esta função será o ponto de entrada da sua biblioteca. Você pode adicionar mais funções
            e exportá-las conforme necessário.
          </p>
          
          <h3>Passo 5: Utilizar a biblioteca em outros pacotes</h3>
          <p>
            Após criar sua biblioteca, outros pacotes podem importar e utilizar suas funções 
            referenciando pelo namespace definido:
          </p>
          <pre>
{`//PENDENTE esperando boot article`}
          </pre>
          
          <div className="alert alert-info mt-4">
            <strong>Dica:</strong> Esta é a estrutura mínima para um pacote do tipo Lib. Conforme sua biblioteca 
            crescer, você pode adicionar mais funcionalidades, testes automatizados e documentação.
          </div>
        </div>
      </div>
    </div>
  )
}

export default PacoteLibArticle