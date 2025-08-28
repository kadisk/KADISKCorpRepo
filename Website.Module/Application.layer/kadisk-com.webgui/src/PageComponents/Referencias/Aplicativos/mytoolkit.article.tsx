import * as React from "react"

const MaintenanceToolkitArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Maintenance Toolkit Command-line</h1>
					<p>
						O <strong>Maintenance Toolkit Command-line</strong> é uma ferramenta usada para configuração e instalação de ecossistemas <strong>Meta Platform</strong>. 
						Ele facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais do ecossistema estejam integrados e funcionando de maneira otimizada.
					</p>

					<h3>Perfis de Instalação</h3>
					<ul>
						<li><strong>localfs-minimal</strong> Configuração mínima, instalada no diretório <em>home</em>, usando o sistema de arquivo local como fonte</li>
						<li><strong>localfs-standard</strong> Configuração padrão, instalada no diretório <em>home</em>, usando o sistema de arquivo local como fonte</li>
						<li><strong>dev-localfs-minimal</strong> Configuração mínima, instalada no local de execução do comando e não do diretório <em>home</em>, usando o sistema de arquivo local como fonte</li>
						<li><strong>dev-localfs-standard</strong> Configuração padrão, instalada no local de execução do comando e não do diretório <em>home</em>, usando o sistema de arquivo local como fonte</li>
						<li><strong>github-release-minimal</strong> Configuração mínima, instala baixando do release hospedada no github</li>
						<li><strong>github-release-standard</strong> Configuração padrão, instala baixando do release hospedada no github</li>
						<li><strong>github-repo-minimal</strong> Configuração mínima, instala clonando do repositório do github</li>
						<li><strong>github-repo-standard</strong> Configuração padrão, instala clonando do repositório do github</li>
						<li><strong>google-drive-minimal</strong> Configuração mínima, instala baixando do google drive</li>
						<li><strong>google-drive-standard</strong> Configuração padrão, instala baixando do google drive</li>
					</ul>

					<h3>Comandos Disponíveis</h3>
					
					<h4>Exibir Perfis de Instalação Disponíveis</h4>
					<p>Exibe as informações sobre os perfis de instalação disponíveis na ferramenta.</p>
					<pre>mytoolkit list-profiles</pre>
					
					<h4>Instalar um Ecossistema na Pasta Padrão do Usuário</h4>
					<p>Instala o ecossistema na pasta de usuário padrão, utilizando o perfil de instalação <strong>standard</strong> por padrão.</p>
					<pre>mytoolkit install</pre>
					<p><strong>Exemplo:</strong></p>
					<pre>mytoolkit install github-release-standard</pre>
					
					<h4>Exibir Detalhes de um Perfil</h4>
					<p>Exibe informações detalhadas sobre um perfil específico, como componentes incluídos e configurações recomendadas.</p>
					<pre>mytoolkit show profile &lt;nome_do_perfil&gt;</pre>
					<p><strong>Exemplo:</strong></p>
					<pre>mytoolkit show profile dev-standard</pre>
					
					<h4>Instalar com Perfis Específicos</h4>
					<p>Escolha o perfil de instalação desejado para ajustar a configuração do ecossistema de acordo com suas necessidades.</p>
					<pre>mytoolkit install "&lt;nome_do_perfil&gt;"</pre>
					<p><strong>Exemplos:</strong></p>
					<pre>
{`mytoolkit install localfs-minimal
mytoolkit install localfs-standard
mytoolkit install dev-localfs-minimal
mytoolkit install dev-localfs-standard
mytoolkit install github-release-minimal
mytoolkit install github-release-standard`}
					</pre>
					
					<h4>Alterar o Caminho dos Dados de Instalação</h4>
					<p>Personalize o caminho onde o ecossistema será instalado especificando o diretório de dados.</p>
					<pre>mytoolkit install --installation-path "&lt;caminho_para_dados&gt;"</pre>
					<p><strong>Exemplo:</strong></p>
					<pre>mytoolkit install --installation-path "~/xpto/EcosystemData"</pre>
					
					<p>
						Os perfis de instalação permitem que você escolha a configuração mais adequada para o seu ambiente. 
						Abaixo está uma lista dos perfis disponíveis:
					</p>
				</div>
			</div>
		</div>
	)
}

export default MaintenanceToolkitArticle