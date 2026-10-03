import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

async function loadSource(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { nasaUpstream } = await loadSource('../src/lib/nasa-upstream.ts');
const { imageryRequest } = await loadSource('../src/lib/imagery.ts');
const { buildQueryString } = await loadSource('../src/lib/api.ts');
const params = input => new URLSearchParams(input);

test('NASA proxy uses its server credential and drops client credentials and unexpected parameters', () => {
  const url = nasaUpstream(['core','planetary','apod'], params({date:'2026-10-01',api_key:'untrusted',url:'https://example.com',callback:'bad'}), 'server-test-key');
  assert.equal(url.origin, 'https://api.nasa.gov');
  assert.equal(url.searchParams.get('api_key'), 'server-test-key');
  assert.equal(url.searchParams.get('date'), '2026-10-01');
  assert.equal(url.searchParams.has('url'), false);
  assert.equal(url.searchParams.has('callback'), false);
});

test('NASA proxy rejects unsupported endpoints, path traversal and arbitrary hosts', () => {
  for (const path of [['https://example.com'],['core','../planetary/apod'],['core','planetary','earth','assets'],['core','mars-photos','api','v1'],['asset','..'],['asset','.'],['asset','a/b'],['tle','../1'],['techport','example.com']]) {
    assert.equal(nasaUpstream(path, params(), 'test'), null, path.join('/'));
  }
});

test('keyless NASA services go to the verified providers without leaking the key', () => {
  for (const [path,origin,pathname] of [
    [['media'],'https://images-api.nasa.gov','/search'],
    [['asset','PIA12345'],'https://images-api.nasa.gov','/asset/PIA12345'],
    [['techport'],'https://techport.nasa.gov','/api/projects'],
    [['techport','1234'],'https://techport.nasa.gov','/api/projects/1234'],
    [['fireballs'],'https://ssd-api.jpl.nasa.gov','/fireball.api'],
    [['tle','25544'],'https://tle.ivanstanojevic.me','/api/tle/25544'],
  ]) {
    const url = nasaUpstream(path, params({api_key:'untrusted'}), 'secret-test-key');
    assert.equal(url.origin,origin); assert.equal(url.pathname,pathname); assert.equal(url.searchParams.has('api_key'),false);
  }
});

test('the TAP proxy preserves SELECT queries but forces JSON and rejects extra statements', () => {
  const query = "SELECT TOP 20 pl_name FROM pscomppars WHERE pl_name LIKE '%Kepler%'";
  const url = nasaUpstream(['exoplanets'],params({query,format:'csv'}),'test');
  assert.equal(url.searchParams.get('query'),query); assert.equal(url.searchParams.get('format'),'json');
  for(const invalid of ['DELETE FROM pscomppars','SELECT * FROM ps; DROP TABLE ps','SELECT * FROM ps -- comment','SELECT /* comment */ * FROM ps','SELECT '+ 'x'.repeat(4000)]) {
    assert.equal(nasaUpstream(['exoplanets'],params({query:invalid}),'test'),null);
  }
});

test('EPIC dates, seven-day asteroid queries, and DONKI date filters survive proxy routing', () => {
  for(const path of [['core','EPIC','api','natural','date','2026-10-01'],['core','neo','rest','v1','feed'],['core','DONKI','FLR']]) assert.ok(nasaUpstream(path,params(),'test'));
  assert.equal(nasaUpstream(['core','EPIC','api','natural','date','invalid'],params(),'test'),null);
  const donki = nasaUpstream(['core','DONKI','CME'],params({startDate:'2026-09-01',endDate:'2026-10-01'}),'test');
  assert.equal(donki.origin, 'https://ccmc.gsfc.nasa.gov');
  assert.equal(donki.pathname, '/DONKI-API/get/CME');
  assert.equal(donki.searchParams.has('api_key'), false);
  assert.equal(donki.searchParams.get('startDate'),'2026-09-01');
  assert.equal(donki.searchParams.get('endDate'),'2026-10-01');
});

test('EONET all-status requests remain explicit so closed events are included', () => {
  assert.equal(params(buildQueryString({status:'all'})).get('status'),'all');
  assert.equal(params(buildQueryString({status:'closed'})).get('status'),'closed');
});

test('EONET area filtering translates app coordinates into NASA west-north-east-south order', () => {
  const query = params(buildQueryString({bbox:[-20,-10,30,40],categories:['wildfires','volcanoes'],limit:50}));
  assert.equal(query.get('bbox'),'-20,40,30,-10');
  assert.equal(query.get('category'),'wildfires,volcanoes');
  assert.equal(query.get('limit'),'50');
  assert.equal(params(buildQueryString({bbox:[0,0,20,10],magMin:0})).get('magMin'),'0');
});

test('GIBS regional imagery accepts zero coordinates and uses WMS 1.3 latitude-longitude axes', () => {
  const url = new URL(imageryRequest(0,0,'2024-02-29',4,'terra'));
  assert.equal(url.searchParams.get('BBOX'),'-4,-4,4,4');
  const asymmetric = new URL(imageryRequest(28,86.9,'2026-10-01',4,'aqua'));
  assert.equal(asymmetric.searchParams.get('BBOX'),'24,82.9,32,90.9');
  assert.equal(asymmetric.searchParams.get('TIME'),'2026-10-01');
  assert.equal(asymmetric.searchParams.get('LAYERS'),'MODIS_Aqua_CorrectedReflectance_TrueColor');
});

test('GIBS bounds clamp at the poles and dateline', () => {
  const url = new URL(imageryRequest(89,179,'2026-10-01',4,'terra'));
  assert.equal(url.searchParams.get('BBOX'),'85,175,90,180');
});

test('invalid coordinates, dates, layers and field-of-view values never produce requests', () => {
  for(const args of [[NaN,0,'2026-10-01',4,'terra'],[91,0,'2026-10-01',4,'terra'],[0,-181,'2026-10-01',4,'terra'],[0,0,'2026-02-30',4,'terra'],[0,0,'2026-13-01',4,'terra'],[0,0,'2026-10-01',0,'terra'],[0,0,'2026-10-01',41,'terra'],[0,0,'2026-10-01',4,'missing']]) assert.equal(imageryRequest(...args),null);
});

const { playableNasaMedia } = await loadSource('../src/lib/media.ts');

test('NASA video playback upgrades HTTP asset URLs and prefers medium-resolution MP4', () => {
  assert.equal(playableNasaMedia(['http://images-assets.nasa.gov/video/Mars~orig.mp4','http://images-assets.nasa.gov/video/Mars~medium.mp4'],'video'), 'https://images-assets.nasa.gov/video/Mars~medium.mp4');
});

test('NASA audio selects playable audio instead of unrelated assets', () => {
  assert.equal(playableNasaMedia(['https://images-assets.nasa.gov/audio/Moon.jpg','http://images-assets.nasa.gov/audio/Moon.mp3'],'audio'),'https://images-assets.nasa.gov/audio/Moon.mp3');
  assert.equal(playableNasaMedia(['https://images-assets.nasa.gov/video/Moon.mp4'],'audio'),undefined);
  assert.equal(playableNasaMedia(['https://images-assets.nasa.gov/audio/Moon.wav'],'video'),undefined);
});

test('playback rejects non-NASA hosts, embedded credentials and invalid protocols', () => {
  assert.equal(playableNasaMedia(['https://images-assets.nasa.gov.example.com/Mars.mp4','https://user:password@images-assets.nasa.gov/Mars.mp4','javascript:alert(1)','file:///Mars.mp4','not-a-url'],'video'),undefined);
});
