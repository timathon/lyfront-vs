netsh interface portproxy add v4tov4 listenport=4200 connectport=4200 connectaddress=$($(wsl hostname -I).Trim())
netsh interface portproxy add v4tov4 listenport=3003 connectport=3003 connectaddress=47.104.155.50

netsh interface portproxy reset
netsh interface portproxy show v4tov4