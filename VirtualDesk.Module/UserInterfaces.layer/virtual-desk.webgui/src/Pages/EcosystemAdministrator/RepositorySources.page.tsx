import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"
import CardContainer from "../../Components/CardContainer"

const SOURCES = {
	"EssentialRepo": [
		{
			"sourceType": "LOCAL_FS",
			"path": "~/Workspaces/meta-platform-repo/repos/essential-repository"
		},
		{
			"sourceType": "GITHUB_RELEASE",
			"repositoryName": "meta-platform-essential-repository",
			"repositoryOwner": "Meta-Platform"
		},
		{
			"sourceType": "GOOGLE_DRIVE",
			"fileId": "12PKZU1Uea1yYnhO7R26Il9eyF__v6MAc"
		}
	],
	"EcosystemCoreRepo": [
		{
			"sourceType": "LOCAL_FS",
			"path": "~/Workspaces/meta-platform-repo/repos/ecosystem-core-repository"
		},
		{
			"sourceType": "GITHUB_RELEASE",
			"repositoryName": "meta-platform-ecosystem-core-repository",
			"repositoryOwner": "Meta-Platform"
		},
		{
			"sourceType": "GOOGLE_DRIVE",
			"fileId": "1-PuPdjU36acGmoPgusYWrMuhyGyMnoRI"
		}
	],
	"PlatformApplicationsRepo": [
		{
			"sourceType": "LOCAL_FS",
			"path": "~/Workspaces/meta-platform-repo/repos/applications-repository"
		}
	],
	"KADISKCorpRepo": [
		{
			"sourceType": "LOCAL_FS",
			"path": "/home/kadisk/Workspaces/Organizations/Kadisk/KADISKCorpRepo"
		}
	],
	"WormsSolutionsRepo": [
		{
			"sourceType": "LOCAL_FS",
			"path": "~/Workspaces/meta-platform-repo/thrid-party-repos/WormsSolutionsRepo"
		}
	]
}

const RepositorySourcesPage = () => {

	return <DefaultPageWithTitle title="Repository Sources" preTitle="Ecosystem Administrator">
				<CardContainer>
					<div className="table-responsive">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Repository</th>
									<th>Source Type</th>
									<th>Details</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(SOURCES).map(([repoName, sources]) => (
									<React.Fragment key={repoName}>
										{sources.map((source, index) => (
											<tr key={`${repoName}-${index}`}>
												{index === 0 && (
													<td rowSpan={sources.length} className="fw-bold">{repoName}</td>
												)}
												<td>{source.sourceType}</td>
												<td>
													{source.sourceType === "LOCAL_FS" && source.path}
													{source.sourceType === "GITHUB_RELEASE" && `${source.repositoryOwner}/${source.repositoryName}`}
													{source.sourceType === "GOOGLE_DRIVE" && source.fileId}
												</td>
											</tr>
										))}
									</React.Fragment>
								))}
							</tbody>
						</table>
					</div>
				</CardContainer>
			</DefaultPageWithTitle>
}

export default RepositorySourcesPage
