import { useEffect, useRef, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, CircleHelp, Clipboard, Cpu, Keyboard, Laptop, MapPin, Menu, Monitor, Network, Phone, Printer, ScanLine, Search, ShoppingBag, Wifi, Wrench, X } from 'lucide-react';
import catalogo from './catalogo.json';
import contato from './contato.json';

const videos = [
  'hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4',
  'hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4',
  'hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4',
  'hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4',
  'hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4',
].map(file => 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/' + file);
const nav = [['home','Home'],['quem-somos','Quem somos'],['vendas','Vendas'],['automacao','Automação comercial'],['manutencao','Manutenção'],['localizacao','Localização'],['contato','Contato']];
const icons = { computer:Laptop, keyboard:Keyboard, scan:ScanLine, wifi:Wifi, printer:Printer, chip:Cpu };
const tel = 'tel:+55' + contato.telefone;
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contato.endereco ? contato.endereco + ', ' + contato.cidade : 'Router Consultoria e Informática, ' + contato.cidade);
const wa = (message: string) => 'https://wa.me/' + contato.whatsapp + '?text=' + encodeURIComponent(message);
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function Brand() {
  return <a className="brand" href="#home" aria-label="Router, início"><span className="mark"><img src="./router.png" alt=""/></span><span><b>ROUTER</b><small>CONSULTORIA & INFORMÁTICA</small></span></a>;
}

function Reveal({children, className=''}:{children:React.ReactNode; className?:string}) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : {y:[13,0]}} viewport={{once:true,amount:.2}} transition={{duration:.65}}>{children}</motion.div>;
}

function Scramble({text}:{text:string}) {
  const [value,setValue]=useState(text);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame=0;
    const timer=window.setInterval(() => {
      const cursor=frame++/1.3;
      setValue([...text].map((letter,i)=>i<cursor||letter===' ' ? letter : i<cursor+4 ? '01X/+'[(i+frame)%5] : '\u00a0').join(''));
      if(cursor>=text.length){clearInterval(timer);setValue(text);}
    },24);
    return () => clearInterval(timer);
  },[text]);
  return <><span className="sr-only">{text}</span><span aria-hidden="true">{value}</span></>;
}

function Film({index,interactive=false}:{index:number;interactive?:boolean}) {
  const ref=useRef<HTMLVideoElement>(null);
  const frame=useRef(0);
  const reduced=useReducedMotion();
  useEffect(() => {
    const video=ref.current;
    if(!video||reduced) return;
    if(interactive){
      const stage=video.closest('.hero');
      const seek=()=>{if(!video.seeking&&Number.isFinite(video.duration)&&video.duration>0) video.currentTime=frame.current*(video.duration-.1);};
      const move=(event:Event)=>{
        const pointer=event as PointerEvent;
        if(pointer.pointerType!=='mouse'||!stage)return;
        const bounds=stage.getBoundingClientRect();
        frame.current=Math.max(0,Math.min(.95,(pointer.clientX-bounds.left)/bounds.width*.8));
        seek();
      };
      const settle=()=>{if(Math.abs(video.currentTime-frame.current*(video.duration-.1))>.06)seek();};
      stage?.addEventListener('pointermove',move);
      video.addEventListener('seeked',settle);
      return ()=>{stage?.removeEventListener('pointermove',move);video.removeEventListener('seeked',settle);};
    }
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting) video.play().catch(()=>{});else video.pause();});
    observer.observe(video);
    return ()=>{observer.disconnect();video.pause();};
  },[interactive,reduced]);
  return <div className={'film film-'+index} aria-hidden="true"><video ref={ref} src={videos[index]} muted playsInline loop={!interactive} preload={interactive?'metadata':'none'}/></div>;
}

function Orbit(){
  const orbit = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const artwork = orbit.current;
    const hero = artwork?.closest('.hero');
    if (!artwork || !hero || reduced) return;

    const reset = () => {
      artwork.style.setProperty('--tilt-x', '0deg');
      artwork.style.setProperty('--tilt-y', '0deg');
    };
    const tilt = (event: Event) => {
      const pointer = event as PointerEvent;
      if (pointer.pointerType !== 'mouse') return;
      const bounds = hero.getBoundingClientRect();
      artwork.style.setProperty('--tilt-x', `${(0.5 - (pointer.clientY - bounds.top) / bounds.height) * 19}deg`);
      artwork.style.setProperty('--tilt-y', `${((pointer.clientX - bounds.left) / bounds.width - 0.5) * 24}deg`);
    };
    hero.addEventListener('pointermove', tilt, {passive:true});
    hero.addEventListener('pointerleave', reset);
    return () => {
      hero.removeEventListener('pointermove', tilt);
      hero.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [reduced]);

  return <div ref={orbit} className="orbit-art" aria-hidden="true">
    <div className="orbit-ring ring-a"/><div className="orbit-ring ring-b"/><div className="orbit-ring ring-c"/>
    <div className="orbit-axis axis-x"/><div className="orbit-axis axis-y"/>
    <span className="orbit-node node-a"/><span className="orbit-node node-b"/><span className="orbit-node node-c"/>
    <div className="orbit-float">
      <div className="orbit-core"><img src="./router-esfera.png" alt="" fetchPriority="high"/></div>
    </div>
  </div>;
}

export function App(){
  const [menu,setMenu]=useState(false);
  const [category,setCategory]=useState('Todas');
  const [query,setQuery]=useState('');
  const [subject,setSubject]=useState('Vendas');
  const [detail,setDetail]=useState('');
  const [name,setName]=useState('');
  const [copied,setCopied]=useState(false);
  const [prepared,setPrepared]=useState('');
  const menuButton=useRef<HTMLButtonElement>(null);
  const categories=['Todas',...new Set(catalogo.map(item=>item.categoria))];
  const items=catalogo.filter(item=>(category==='Todas'||item.categoria===category)&&normalize(item.nome+' '+item.descricao+' '+item.categoria).includes(normalize(query.trim())));
  function request(area:string, text=''){
    setSubject(area);setDetail(text);setPrepared('');setCopied(false);
  }
  useEffect(()=>{
    if(!menu)return;
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){setMenu(false);menuButton.current?.focus();}};
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[menu]);
  return <>
    <a className="skip" href="#conteudo">Pular para o conteúdo</a>
    <header className="top"><div className="wrap top-in"><Brand/><nav className="desktop-nav" aria-label="Navegação principal">{nav.slice(1,6).map(([id,label])=><a key={id} href={'#'+id}>{label}</a>)}</nav><div className="top-actions"><a className="btn small" href="#contato">Fale com a Router <ArrowUpRight size={15}/></a><button ref={menuButton} className="menu-toggle" aria-controls="site-menu" aria-expanded={menu} aria-label={menu?'Fechar menu':'Abrir menu'} onClick={()=>setMenu(!menu)}>{menu?<X size={22}/>:<Menu size={22}/>}</button></div></div>
    {menu&&<nav id="site-menu" className="mobile-nav" aria-label="Menu do site">{nav.map(([id,label])=><a key={id} href={'#'+id} onClick={()=>setMenu(false)}>{label}<ChevronRight size={16}/></a>)}</nav>}</header>
    <main id="conteudo">
      <section id="home" className="hero">
        <Film index={0} interactive/><div className="dot-grid"/><div className="watermark" aria-hidden="true">ROUTER</div><Orbit/>
        <div className="wrap hero-inner"><div className="hero-kicker"><span className="live-dot"/> PEDERNEIRAS, SP <span className="divider"/> DESDE 2007</div><div className="hero-content">
        <div><h1><Scramble text="Tecnologia para"/><br/><span className="gradient-text"><Scramble text="o varejo."/></span></h1><p>Equipamentos, sistemas de gestão e suporte técnico para manter o seu negócio funcionando.</p><div className="actions"><a className="btn" href="#contato">Converse com a Router <ArrowUpRight size={17}/></a><a className="btn ghost" href="#servicos">Conheça as soluções <ArrowDown size={16}/></a></div></div>
        <a href="#quem-somos" className="hero-side"><span>2007 — 2027</span><strong>Rumo aos<br/>20 anos.</strong><ArrowDown size={17}/></a></div></div>
      </section>
      <div className="service-strip"><div className="wrap strip"><a href="#vendas"><ShoppingBag size={19}/> Vendas <ArrowUpRight size={15}/></a><a href="#automacao"><Network size={19}/> Automação comercial <ArrowUpRight size={15}/></a><a href="#manutencao"><Wrench size={19}/> Manutenção <ArrowUpRight size={15}/></a></div></div>
      <section className="about scene" id="quem-somos"><Film index={1}/><div className="wrap about-body"><Reveal><p className="eyebrow">Quem somos</p><h2>Seu negócio tem<br/>com quem contar.</h2><p className="lede">Desde 2007, a Router ajuda o pequeno varejo a escolher equipamentos, implantar sistemas e resolver problemas de informática no dia a dia.</p><p>Trabalhamos com transparência e honestidade, da primeira orientação ao suporte técnico. Quando surgem dúvidas fiscais sobre a operação do sistema, trabalhamos em parceria com o escritório de contabilidade do cliente.</p></Reveal><img className="stamp" src="./selo.png" alt="Qualidade desde 2007" loading="lazy"/></div></section>
      <section className="section services scene" id="servicos"><Film index={2}/><div className="wrap"><Reveal className="section-title"><p className="eyebrow">Soluções</p><h2>Da escolha do equipamento<br/>ao suporte diário.</h2></Reveal><div className="service-grid">
        <a href="#vendas"><ShoppingBag/><h3>Vendas</h3><p>Informática, eletrônicos e suprimentos para o seu negócio.</p><span>Ver catálogo <ArrowUpRight size={16}/></span></a>
        <a href="#automacao"><Network/><h3>Automação comercial</h3><p>Gestão, frente de caixa, food e emissão de documentos fiscais.</p><span>Conhecer sistemas <ArrowUpRight size={16}/></span></a>
        <a href="#manutencao"><Wrench/><h3>Manutenção</h3><p>Diagnóstico e suporte para PCs, notebooks, games e redes.</p><span>Conhecer o suporte <ArrowUpRight size={16}/></span></a>
      </div></div></section>
      <section className="section catalog" id="vendas"><div className="wrap"><Reveal className="split-title"><div><p className="eyebrow">Vendas</p><h2>Equipe o seu negócio.</h2></div><p>Explore as linhas de produtos e consulte a Router sobre modelos, valores e disponibilidade.</p></Reveal>
      <div className="catalog-tools"><div className="filters" role="group" aria-label="Categorias">{categories.map(item=><button key={item} aria-pressed={item===category} onClick={()=>setCategory(item)}>{item}</button>)}</div><label className="search"><Search size={17}/><input aria-label="Buscar no catálogo" placeholder="Buscar no catálogo" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
      <div className="product-grid">{items.map(item=>{const Icon=icons[item.icone as keyof typeof icons];return <article className="product" key={item.nome}><div className="product-art"><Icon size={60} strokeWidth={1.15}/></div><div className="product-copy"><p className="eyebrow">{item.categoria}</p><h3>{item.nome}</h3><p>{item.descricao}</p><a href="#contato" onClick={()=>request('Vendas','Gostaria de consultar opções de '+item.nome.toLowerCase()+'.')}>Pedir orçamento <ArrowUpRight size={16}/></a></div></article>;})}</div>
      {!items.length&&<div className="empty"><p>Nenhuma linha de produtos encontrada.</p><button onClick={()=>{setCategory('Todas');setQuery('');}}>Limpar filtros</button></div>}
      </div></section>
      <section className="section automation scene" id="automacao"><Film index={3}/><div className="wrap"><Reveal className="split-title"><div><p className="eyebrow">Automação comercial</p><h2>Sistemas para<br/>vender e gerir.</h2></div><p>Da implantação ao treinamento, ajudamos sua equipe a usar o sistema que faz sentido para sua operação.</p></Reveal><div className="feature-grid">
      {[['Gestão comercial','Produtos, estoque e rotinas de venda.',Monitor],['Frente de caixa','Equipamentos e sistemas para o atendimento.',ScanLine],['Operação food','Sistemas para pedidos e rotinas de alimentação.',ShoppingBag],['Documentos fiscais','Apoio na configuração e no uso, em parceria com a contabilidade.',Printer]].map(([title,copy,Icon])=>{const Feature=Icon as typeof Monitor;return <article key={String(title)}><Feature size={23}/><h3>{String(title)}</h3><p>{String(copy)}</p></article>;})}</div><a className="btn" href="#contato" onClick={()=>request('Automação comercial')}>Conversar sobre automação <ArrowUpRight size={16}/></a></div></section>
      <section className="section maintenance" id="manutencao"><div className="wrap maintenance-grid"><Reveal><p className="eyebrow">Manutenção</p><h2>Seu equipamento<br/>de volta à rotina.</h2><p className="lede">Conte o que está acontecendo com seu equipamento. A Router orienta sobre o diagnóstico e os próximos passos.</p><a className="btn" href="#contato" onClick={()=>request('Manutenção')}>Solicitar atendimento <ArrowUpRight size={17}/></a></Reveal><div className="maintenance-list">{[['PCs e notebooks','Diagnóstico, manutenção e atualização de hardware.',Laptop],['Games','Avaliação de problemas em equipamentos de jogos.',Cpu],['Redes e instalações','Instalação e configuração de equipamentos e redes.',Wifi]].map(([title,copy,Icon])=>{const Device=Icon as typeof Laptop;return <div key={String(title)}><Device size={25}/><div><h3>{String(title)}</h3><p>{String(copy)}</p></div></div>;})}</div></div></section>
      <section className="section contact-zone scene" id="contato"><Film index={4}/><div className="wrap contact-grid"><div><p className="eyebrow">Contato</p><h2>Como podemos<br/>ajudar?</h2><p className="lede">Conte o que o seu negócio precisa e fale com a equipe da Router.</p><a className="contact-link" href={tel}><Phone size={17}/>{contato.telefoneExibicao}<ArrowUpRight size={16}/></a>
      <div id="localizacao" className="location"><p className="eyebrow">Localização</p><h3><MapPin size={19}/> {contato.cidade}</h3>{contato.endereco?<p>{contato.endereco}</p>:<p>Confirme o endereço de atendimento com a equipe antes da visita.</p>}<a href={mapUrl} target="_blank" rel="noopener noreferrer">Buscar no Google Maps <ArrowUpRight size={15}/></a></div></div>
      <form className="form" onSubmit={e=>{e.preventDefault();const message='Olá, Router! Meu nome é '+name.trim()+'. Preciso de ajuda com '+subject.toLowerCase()+'.\n\n'+detail.trim();setPrepared(message);setCopied(false);}}>
        <label>Seu nome<input required value={name} onChange={e=>{setName(e.target.value);setPrepared('');}} maxLength={100} placeholder="Como podemos chamar você?"/></label>
        <label>Assunto<select value={subject} onChange={e=>{setSubject(e.target.value);setPrepared('');}}>{['Vendas','Automação comercial','Manutenção','Outro assunto'].map(s=><option key={s}>{s}</option>)}</select></label>
        <label>O que você precisa?<textarea required rows={4} value={detail} onChange={e=>{setDetail(e.target.value);setPrepared('');}} maxLength={900} placeholder="Descreva o produto, o serviço ou a situação."/></label>
        <button className="btn" type="submit">Preparar solicitação <ArrowRight size={17}/></button>
        {prepared&&<div className="prepared" aria-live="polite"><p>Sua mensagem está pronta.</p><textarea aria-label="Mensagem preparada" readOnly rows={4} value={prepared}/>{contato.whatsapp?<a className="btn" href={wa(prepared)} target="_blank" rel="noopener noreferrer">Abrir WhatsApp <ArrowUpRight size={16}/></a>:<button type="button" className="btn ghost" onClick={async()=>{try{await navigator.clipboard.writeText(prepared);setCopied(true);}catch{setCopied(false);}}}>{copied?<Check size={16}/>:<Clipboard size={16}/>} {copied?'Mensagem copiada':'Copiar mensagem'}</button>}</div>}
      </form></div></section>
    </main>
    <footer><div className="wrap footer"><Brand/><span>Router Consultoria & Informática · Desde 2007</span><a href="#home">Voltar ao topo ↑</a></div></footer>
  </>;
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('root')!;
  if (root.hasChildNodes()) hydrateRoot(root, <App/>);
  else createRoot(root).render(<App/>);
}
