# Notes

## Padrões de Portas dos Containers

- **3XXX**: Containers de desenvolvimento e teste. Podem ser criados, apagados e reiniciados facilmente. Acessíveis externamente.
- **8XXX**: Containers acessíveis externamente que rodam a parte exposta dos aplicativos e da plataforma, como APIs e front-ends.
- **6XXX**: Serviços e aplicações com acesso apenas interno, com as devidas permissões.
- **4XXX**: Containers com serviços de persistência e manipulação de dados, como SQLite, Neo4J, MySQL, Oracle, PostgreSQL, InfluxDB, etc.
- **5XXX**: Qualquer outro serviço diferente da plataforma, como Python, Kafka, Processamento, OpenCV, entre outros.

## Reinstalar KadiskCorpRepo localmente
 ```bash
rm -rf ~/EcosystemData/
mywizard install --profile localfs-release-standard
repo register source KADISKCorpRepo LOCAL_FS --localPath /home/kadisk/Workspaces/Organizations/Kadisk/KADISKCorpRepo
repo install KADISKCorpRepo LOCAL_FS --executables "kadisk-com" "virtual-desk" "virtual-desk-gui" "kadisk-transit-proxy" "kadisk-domain-router-proxy"
 ```