# Create Self Signed HTTPS Certificate

Run these commands

```
openssl req -new -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```

It's important that these are located not in the backend directory but the root directory of your http2 exercise project.