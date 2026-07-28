const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '108.174.151.131',
  port: 22022,
  username: 'root',
  password: 'Jpenxovais2028@'
};

const DB_PASS = 'VpsJpEnxovais#2026';

const commands = [
  "docker buildx build --network host -f /etc/easypanel/projects/catalogojpenxovais/catalogo/code/Dockerfile -t easypanel/catalogojpenxovais/catalogo --label 'keep=true' --build-arg 'DB_HOST=banco' --build-arg 'DB_USER=mysql' --build-arg 'DB_PASSWORD=9i5sz45jqkysp16p5tsi' --build-arg 'DB_NAME=catalogojpenxovais' --build-arg 'GIT_SHA=a10b58425aef9185722bd56e1a3aba5ad0b216ae' /etc/easypanel/projects/catalogojpenxovais/catalogo/code/"
];

conn.on('ready', () => {
  console.log('SSH Connection Established.');
  
  const cmd = commands.join(' && ');
  console.log('Starting Deployment. This may take 3-5 minutes...');
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('\\nDeployment Finished. Exit Code: ' + code);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect(config);
