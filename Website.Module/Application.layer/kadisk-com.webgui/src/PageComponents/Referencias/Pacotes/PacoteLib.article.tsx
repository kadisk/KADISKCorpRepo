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
        </div>
      </div>
    </div>
  )
}

export default PacoteLibArticle