/* Shared navigation: mouse, touch and keyboard. */
(()=>{
 const header=document.querySelector('.ch-header');if(!header)return;
 const nav=header.querySelector('#site-navigation');
 const menu=header.querySelector('.ch-menu-button');
 const button=header.querySelector('.ch-dropdown-button');
 const dropdown=header.querySelector('#department-dropdown');
 const mobile=matchMedia('(max-width:960px)');
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
