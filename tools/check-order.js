/* Verifica a ordem de carga dos arquivos js/: acha referencias, no nivel de topo, a nomes declarados em arquivos POSTERIORES
   (funcoes que antes eram "içadas" quando o jogo era um arquivo so). Rode na raiz do projeto: npm i --no-save acorn && node tools/check-order.js */
const fs=require('fs'),path=require('path'),os=require('os');
const acorn=require('acorn');
const files=fs.readdirSync('js').filter(f=>f.endsWith('.js')).sort();
/* pixel/*.js carregam antes dos js/*: contam como ja declarados */
const pix=fs.readdirSync('pixel').filter(f=>f.endsWith('.js'));
const declared=new Map();   /* nome -> indice do arquivo que o declara */
const asts=[];
files.forEach((f,i)=>{const code=fs.readFileSync('js/'+f,'utf8');const ast=acorn.parse(code,{ecmaVersion:2022,sourceType:'script',locations:true});asts.push(ast);
 for(const n of ast.body){
  if(n.type==='FunctionDeclaration')declared.set(n.id.name,{i,kind:'function'});
  if(n.type==='VariableDeclaration')for(const d of n.declarations){const names=[];(function g(p){if(p.type==='Identifier')names.push(p.name);else if(p.type==='ObjectPattern')p.properties.forEach(q=>g(q.value||q.argument));else if(p.type==='ArrayPattern')p.elements.forEach(q=>q&&g(q));else if(p.type==='AssignmentPattern')g(p.left);else if(p.type==='RestElement')g(p.argument);})(d.id);names.forEach(nm=>declared.set(nm,{i,kind:n.kind}));}
 }});
const pixNames=new Set();for(const f of pix){const code=fs.readFileSync('pixel/'+f,'utf8');try{const ast=acorn.parse(code,{ecmaVersion:2022,sourceType:'script'});for(const n of ast.body){if(n.type==='FunctionDeclaration')pixNames.add(n.id.name);if(n.type==='VariableDeclaration')n.declarations.forEach(d=>d.id.name&&pixNames.add(d.id.name));}}catch(e){}}
const problems=[];
function visit(node,fileIdx,parent){
 if(!node||typeof node.type!=='string')return;
 if(node.type==='FunctionDeclaration'||node.type==='FunctionExpression'||node.type==='ArrowFunctionExpression')return; /* corpo so roda depois, quando tudo ja carregou */
 if(node.type==='Identifier'){
  const isProp=parent&&((parent.type==='MemberExpression'&&parent.property===node&&!parent.computed)||(parent.type==='Property'&&parent.key===node&&!parent.computed&&!parent.shorthand));
  if(!isProp){const d=declared.get(node.name);if(d&&d.i>fileIdx&&!pixNames.has(node.name))problems.push({file:files[fileIdx],line:node.loc.start.line,name:node.name,kind:d.kind,def:files[d.i]});}
  return;}
 for(const k in node){if(k==='loc'||k==='type')continue;const v=node[k];if(Array.isArray(v))v.forEach(x=>visit(x,fileIdx,node));else if(v&&typeof v.type==='string')visit(v,fileIdx,node);}
}
asts.forEach((ast,i)=>ast.body.forEach(n=>{if(n.type==='FunctionDeclaration')return;visit(n,i,null);}));
const uniq=new Map();for(const p of problems){const k=p.file+'|'+p.name;if(!uniq.has(k))uniq.set(k,p);}
if(!uniq.size)console.log('OK: nenhuma referencia de topo a nomes de arquivos posteriores');
for(const p of uniq.values())console.log(p.file+':'+p.line,p.name,'('+p.kind+' em '+p.def+')');
process.exitCode=uniq.size?1:0;
