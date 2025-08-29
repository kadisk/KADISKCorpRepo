import * as React from "react"

const RepositoryManagerArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Repository Manager</h1>
					<p>
						O <strong>Repository Manager Command-Line</strong> é responsável pelo gerenciamento e configuração de repositórios, 
						atuando como um configurador centralizado. Ele permite:
					</p>
					
					<ul>
						<li><strong>Listar Repositórios Registrados</strong>: Exibe uma lista de todos os repositórios disponíveis, incluindo suas fontes, que podem ser locais ou remotas.</li>
						<li><strong>Registrar Novas Fontes de Repositório</strong>: Permite adicionar novas fontes de repositório e especificar seus tipos.</li>
						<li><strong>Instalar Repositórios</strong>: Instala repositórios selecionados.</li>
						<li><strong>Atualizar Repositórios</strong>: Atualiza repositórios instalados para as versões mais recentes.</li>
						<li><strong>Listar Repositórios Instalados</strong>: Exibe uma lista dos repositórios que já estão instalados e registrados para uso.</li>
						<li><strong>Desinstalar Repositórios</strong>: Remove repositórios do ecossistema.</li>
						<li><strong>Exibir Detalhes de um Repositório</strong>: Mostra informações detalhadas sobre um repositório específico.</li>
						<li><strong>Configurar Repositórios</strong>: Permite ajustar opções específicas de um repositório instalado.</li>
						<li><strong>Gerenciar Fontes</strong>: Possibilidade de adicionar, remover e listar fontes de repositórios.</li>
					</ul>

					<h3>Funcionalidades</h3>
					<ul>
						<li><strong>Gerenciamento Completo de Repositórios</strong>: Controle total sobre a instalação, atualização e remoção de repositórios.</li>
						<li><strong>Suporte a Múltiplas Fontes</strong>: Capacidade de registrar e gerenciar repositórios de diferentes fontes e tipos.</li>
						<li><strong>Atualizações Automatizadas</strong>: Possibilidade de atualizar todos os repositórios instalados simultaneamente.</li>
					</ul>

					<h3>Comandos</h3>
					
					<h4>Gerenciamento de Fontes</h4>
					
					<h5>Mostrar Informações sobre Fontes</h5>
					<p>Exibe todas as informações sobre as fontes de repositórios disponíveis para instalação.</p>
					<pre>repo sources</pre>
					
					<h5>Listar Fontes</h5>
					<p>Lista todas as fontes registradas.</p>
					<pre>repo list sources</pre>
					
					<h5>Registra uma Nova Fonte de Repositório</h5>
					<p>Registra uma nova fonte de repositório para ser instalado.</p>
					<pre>
{`repo register source [repositoryNamespace] [sourceType] --paramA "valueA" --paramB "value"

repo register source MyPersonalRepo LOCAL_FS --localPath "~/my-personal-repo"
repo register source MyPersonalRepo GITHUB_RELEASE --repoName "my-personal-repo" --repoOwner "my-user"
repo register source MyPersonalRepo GOOGLE_DRIVE --fileId "AaBbCcDdEeFe123456__--qwertyuAAAA"`}
					</pre>
					
					<h5>Remover Fonte</h5>
					<p>Permite remover uma fonte de um repositório registrado.</p>
					<pre>
{`repo remove source [repositoryNamespace] [sourceType]

repo remove source MyPersonalRepo LOCAL_FS
repo remove source MyPersonalRepo GITHUB_RELEASE
repo remove source MyPersonalRepo GOOGLE_DRIVE`}
					</pre>

					<h4>Gerenciamento de Repositórios</h4>
					
					<h5>Listar Repositórios Instalados</h5>
					<p>Exibe todos os repositórios que estão instalados e disponíveis para uso.</p>
					<pre>repo list installed</pre>
					
					<h5>Exibir Detalhes de um Repositório instalado</h5>
					<p>Mostra informações detalhadas sobre um repositório específico instalado.</p>
					<pre>repo show [repositoryNamespace]</pre>
					<p><strong>Exemplo:</strong></p>
					<pre>repo show EssentialRepo</pre>
					
					<h5>Instalar um Repositório</h5>
					<p>Instala um repositório especificado a partir de uma fonte.</p>
					<pre>
{`repo install [repositoryNamespace] [sourceType]
repo install [repositoryNamespace] [sourceType] --executables exec1 "exec2" exec3`}
					</pre>
					<p><strong>Exemplo:</strong></p>
					<pre>
{`repo install EcosystemCoreRepo LOCAL_FS
repo install EssentialRepo LOCAL_FS --executables supervisor mytoolkit repo
repo install EcosystemCoreRepo GITHUB_RELEASE --executables "executor-manager" "executor-panel" explorer executor`}
					</pre>
					
					<h5>Atualizar um Repositório Instalado</h5>
					<p>Atualiza um repositório instalado para a versão mais recente disponível na fonte especificada.</p>
					<pre>repo update [repositoryNamespace] [sourceType]</pre>
					<p><strong>Exemplo:</strong></p>
					<pre>repo update EssentialRepo LOCAL_FS</pre>
				</div>
			</div>
		</div>
	)
}

export default RepositoryManagerArticle