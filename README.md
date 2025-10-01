# KADISK Corporate Repository

## Configuração
Para que os componente desse repositório possa ser usado é preciso que seja registrado no ecosistema que ele sera usado
 ```bash
repo register source KADISKCorpRepo LOCAL_FS --localPath ~/KADISKCorpRepo
 ```


## Instando os aplicativos no ecosistema
Instalando o website corporativo da *Kadisk Engenharia de Software*
```bash
repo install KADISKCorpRepo LOCAL_FS --executables "kadisk-com"
```

Instalando o serviço corporativo *Virtual Desk* e sobre a front-end
```bash
repo install KADISKCorpRepo LOCAL_FS --executables "virtual-desk" "virtual-desk-gui"
```

Instalando o serviço de proxy corporativo
```bash
repo install KADISKCorpRepo LOCAL_FS --executables "kadisk-transit-proxy" "kadisk-domain-router-proxy"
```

## Atualizando o repositório no ecosistema

```bash
repo update KADISKCorpRepo
```