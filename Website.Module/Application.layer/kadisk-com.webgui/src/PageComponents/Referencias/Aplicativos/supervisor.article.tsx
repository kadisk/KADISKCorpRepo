import * as React from "react"

const ExecutionSupervisorArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Execution Supervisor</h1>
					<p>
						O <strong>Execution Supervisor</strong> é responsável pela análise e supervisão de aplicações compatíveis com o ecossistema <strong>Meta Platform</strong>, 
						especificamente aquelas executadas pelo <em>package-executor</em>. As aplicações gerenciadas por ele podem expor um socket de comunicação, 
						permitindo que o supervisor interaja diretamente com a aplicação em execução. Essa interação é facilitada pelo acesso à instância por meio de um arquivo <code>.sock</code>, 
						que é especificado no momento da execução da instância.
					</p>

					<h3>Comandos Disponíveis</h3>
					<pre>
{`# Listar sockets
supervisor sockets

# Mostrar status
supervisor status [SOCKET_FILENAME]

# Listar tarefas
supervisor tasks [SOCKET_FILENAME]

# Visualizar logs
supervisor log [SOCKET_FILENAME]

# Matar Execução
supervisor kill [SOCKET_FILENAME]

# Detalhar informações de tarefas
supervisor show task [TASK_ID] [SOCKET_FILENAME]`}
					</pre>

					<h3>Gerenciamento de uma instância do package-executor</h3>
					<p>
						A ferramenta oferece uma série de comandos para gerenciar diversos aspectos da aplicação. 
						Abaixo, você encontrará uma descrição detalhada de cada comando e exemplos de uso.
					</p>

					<h4>Listar sockets</h4>
					<p>Lista todos os sockets de todas as instâncias em execução</p>
					<pre>supervisor sockets</pre>

					<h4>Mostrar status</h4>
					<p>Mostra status de um instância em execução</p>
					<pre>supervisor status [SOCKET_FILENAME]</pre>

					<h4>Listar tarefas</h4>
					<p>Lista todas as tarefas de um instância em execução</p>
					<pre>supervisor tasks [SOCKET_FILENAME]</pre>

					<h4>Visualizar logs</h4>
					<p>Fica exibindo o logs de uma instância em execução</p>
					<pre>supervisor log [SOCKET_FILENAME]</pre>

					<h4>Matar Execução</h4>
					<p>Mata a execução de uma instância.</p>
					<pre>supervisor kill [SOCKET_FILENAME]</pre>

					<h4>Detalhar informações de tarefas</h4>
					<p>Mostra informações detalhada de uma tarefas específica</p>
					<pre>supervisor show task [TASK_ID] [SOCKET_FILENAME]</pre>
				</div>
			</div>
		</div>
	)
}

export default ExecutionSupervisorArticle