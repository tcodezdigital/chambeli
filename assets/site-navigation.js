/* Shared navigation: mouse, touch and keyboard. */
(()=>{
 const header=document.querySelector('.ch-header');if(!header)return;
 const nav=header.querySelector('#site-navigation');
 const menu=header.querySelector('.ch-menu-button');
 const button=header.querySelector('.ch-dropdown-button');
 const dropdown=header.querySelector('#department-dropdown');
 // Add the sponsorship destination to every existing shared header.
 const sponsorPath='/category/sponsor-a-child/';
 let sponsor=nav.querySelector('a[data-sponsor-navigation]')||nav.querySelector('a[href="'+sponsorPath+'"]')||nav.querySelector('a[href="/sponsor-a-child/"]');
 if(!sponsor){
  sponsor=document.createElement('a');
  sponsor.textContent='Sponsor a Child';
  sponsor.href=sponsorPath;
  const gallery=nav.querySelector('a[href="/gallery/"]');
  const donate=nav.querySelector('.ch-donate');
  nav.insertBefore(sponsor,gallery||donate||null);
 }
 sponsor.setAttribute('data-sponsor-navigation','true');
 sponsor.setAttribute('href',sponsorPath);
 // Determine the active page from the URL, including named sponsorship profiles.
 const normalize=p=>{let path=p.replace(/\/index\.html$/,'/');if(!path.endsWith('/'))path+='/';return path;};
 const current=normalize(window.location.pathname);
 const profilePaths=['/muhammad-ali-hasnain/','/muhammad-alyan/','/muhammad-yasir-khan/'];
 nav.querySelectorAll('a').forEach(a=>{
  a.removeAttribute('aria-current');
  a.classList.remove('ch-parent-active');
  const target=normalize(new URL(a.getAttribute('href'),window.location.href).pathname);
  if(target===current)a.setAttribute('aria-current','page');
 });
 if(current==='/sponsor-a-child/'||current===sponsorPath)sponsor.setAttribute('aria-current','page');
 if(profilePaths.includes(current))sponsor.classList.add('ch-parent-active');
 if(['/school/','/rehabilitation-and-fitness-center/','/female-vocational-training-center/'].includes(current))header.querySelector('.ch-dept-link').classList.add('ch-parent-active');
 const mobile=matchMedia('(max-width:1060px)');
 const department=header.querySelector('.ch-department');
 function closeDropdown(){dropdown.hidden=true;button.setAttribute('aria-expanded','false');}
 function closeMenu(){menu.setAttribute('aria-expanded','false');nav.hidden=mobile.matches;closeDropdown();}
 function sync(){closeMenu();}
 document.documentElement.classList.add('ch-nav-ready');sync();
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.hidden=!open;if(!open)closeDropdown();});
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));dropdown.hidden=!open;});
 button.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();dropdown.hidden=false;button.setAttribute('aria-expanded','true');dropdown.querySelector('a').focus();}});
 header.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!dropdown.hidden){closeDropdown();button.focus();}else if(mobile.matches&&!nav.hidden){closeMenu();menu.focus();}});
 document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu();else if(!department.contains(e.target))closeDropdown();});
 department.addEventListener('focusout',()=>{setTimeout(()=>{if(!department.contains(document.activeElement))closeDropdown();},0);});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 mobile.addEventListener('change',sync);
 const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
})();
