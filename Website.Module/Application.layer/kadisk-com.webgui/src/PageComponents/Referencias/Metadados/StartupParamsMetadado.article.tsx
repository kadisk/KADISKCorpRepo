import * as React from "react"

const StartupParamsMetadadoArticle = () => {
  return (
    <div className="container-xl">
      <div className="row">
        <div className="col">
          <h1>Metadado de Parâmetros de Inicialização (Startup Params)</h1>
          
          <p>
              Este metadado fornece parâmetros de configuração para a inicialização da aplicação, 
              seguindo as definições especificadas no arquivo <code>metadata/boot.json</code>.
            </p>
          
          <h2>Como Funciona</h2>
          <p>
            O arquivo <code>startup-params.json</code> contém valores de configuração que são passados 
            para o processo de inicialização da aplicação. Durante a execução, apenas os parâmetros 
            previamente mapeados no arquivo <code>boot.json</code> são considerados e utilizados.
          </p>

          <h3>Exemplo de Estrutura</h3>
              <pre>
{`{
  "parametro1": "valor1",
  "parametro2": 123,
  "parametro3": {
    "subparam": true
  }
}`}
              </pre>
          
          <h3>Fluxo de Processamento</h3>
          <ol>
            <li>A aplicação inicia o processo de boot</li>
            <li>O sistema carrega as definições do <code>boot.json</code></li>
            <li>Os parâmetros do <code>startup-params.json</code> são validados conforme o schema definido</li>
            <li>Apenas os parâmetros mapeados no <code>boot.json</code> são utilizados na execução</li>
          </ol>
          
        </div>
      </div>
    </div>
  )
}

export default StartupParamsMetadadoArticle