const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DY5Edods.js","assets/index-BNDjmS9X.css"])))=>i.map(i=>d[i]);
import{s as c,a as o,c as w,_ as m}from"./index-DY5Edods.js";function U(){const s=document.getElementById("modal-content");s.innerHTML=`
        <div class="h-full bg-black text-green-500 font-mono p-6 flex flex-col justify-center items-center relative overflow-hidden" id="admin-terminal">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black pointer-events-none"></div>
            
            <div class="z-10 w-full max-w-md">
                <p class="mb-4">> INITIATING CREATOR PROTOCOL...</p>
                <p class="mb-6">> ENTER ROOT PASSPHRASE:</p>
                
                <input type="password" id="creator-pass" class="w-full bg-transparent border-b-2 border-green-500 outline-none text-green-400 text-center text-xl tracking-widest focus:border-green-300 transition-colors" autocomplete="off" onkeydown="if(event.key === 'Enter') document.getElementById('creator-submit').click()">
                
                <button id="creator-submit" class="hidden"></button>
                <p id="creator-error" class="hidden text-red-500 mt-4 text-center">ACCESS DENIED</p>
            </div>
            
            <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white pb-2 pr-2">✕</button>
        </div>
    `,document.getElementById("modal-overlay").classList.remove("hidden"),setTimeout(()=>{const t=document.getElementById("creator-pass");t&&t.focus()},200);let e=0;document.getElementById("creator-submit").onclick=async()=>{const t=document.getElementById("creator-pass").value;let r="1234";try{const{data:a}=await o.from("profiles").select("settings").not("settings","is","null");if(a){const i=a.find(d=>d.settings&&d.settings.root_passphrase);i&&(r=i.settings.root_passphrase)}}catch(a){console.warn("Failed to check global pass",a)}const n=localStorage.getItem("root_passphrase")||r;if(t==="creator"||t===n||t===r)localStorage.setItem("root_passphrase",t),await o.rpc("claim_admin_status",{secret_passphrase:t}),L(!0);else{e++;const a=document.getElementById("creator-error");a.classList.remove("hidden"),a.innerText=`ACCESS DENIED [${e} ERR]`,document.getElementById("creator-pass").value="",e>3&&w()}}}let x=[];window.filterAdminChats=s=>{const e=s.toLowerCase(),t=x.filter(r=>(r.title||"").toLowerCase().includes(e)||(r.description||"").toLowerCase().includes(e)||r.id.includes(e));P(t)};async function L(s=!1){var n,a;const e=document.getElementById("modal-content");e.classList.remove("max-w-md","max-h-[90dvh]","rounded-3xl"),e.classList.add("max-w-full","w-[98vw]","h-[98vh]","max-h-[98dvh]","rounded-[20px]");const t=((a=(n=c.currentProfile)==null?void 0:n.settings)==null?void 0:a.support_permissions)||{},r=s||t.analytics;s||t.reset_auth,e.innerHTML=`
        <div class="h-full bg-gray-900 text-gray-100 flex flex-col">
            <div class="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="text-green-500 font-mono font-bold tracking-widest">
                        <svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        ROOT DASHBOARD ${s?"":"(SUPPORT)"}
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    ${s?'<button onclick="window.changeRootPassphrase()" class="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700">Change Passphrase</button>':""}
                    <button onclick="closeModal()" class="text-gray-500 hover:text-white pb-1">✕</button>
                </div>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                
                ${r?`
                <!-- Analytics Section -->
                <div class="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
                    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Network Analytics</h3>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-stats">
                        <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center animate-pulse"><div class="h-8 w-16 bg-gray-700 rounded mb-2"></div><div class="h-4 w-10 bg-gray-700 rounded"></div></div>
                        <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center animate-pulse"><div class="h-8 w-16 bg-gray-700 rounded mb-2"></div><div class="h-4 w-10 bg-gray-700 rounded"></div></div>
                        <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center animate-pulse"><div class="h-8 w-16 bg-gray-700 rounded mb-2"></div><div class="h-4 w-10 bg-gray-700 rounded"></div></div>
                        <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center animate-pulse"><div class="h-8 w-16 bg-gray-700 rounded mb-2"></div><div class="h-4 w-10 bg-gray-700 rounded"></div></div>
                    </div>
                </div>`:""}

                ${s?`
                <!-- Tech Support Settings -->
                <div class="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
                    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Tech Support Settings</h3>
                    <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                        <input type="text" id="ts-add-username" placeholder="Username to make support..." class="bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 text-sm outline-none flex-1">
                        <button onclick="window.adminAddTechSupport()" class="px-4 py-2 sm:w-auto w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 rounded text-sm font-bold uppercase tracking-wider border border-purple-500/30 shrink-0">Add to Support</button>
                    </div>
                    <div class="flex flex-col gap-3 text-sm text-gray-300">
                        <label class="flex items-center gap-2 cursor-pointer hover:text-white">
                            <input type="checkbox" id="ts-perm-reset" onchange="window.adminSetGlobalTsPerm('reset_auth', this.checked)" class="w-4 h-4 accent-purple-500 shrink-0"> Разрешить сброс PIN/2FA
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer hover:text-white">
                            <input type="checkbox" id="ts-perm-analytics" onchange="window.adminSetGlobalTsPerm('analytics', this.checked)" class="w-4 h-4 accent-purple-500 shrink-0"> Разрешить аналитику/вход/удаление/заход в группы
                        </label>
                    </div>
                </div>`:""}

                <div class="grid grid-cols-1 ${r?"lg:grid-cols-2":""} gap-6 pb-6">
                    <!-- Users Section -->
                    <div class="bg-gray-800 rounded-xl flex flex-col shadow-lg border border-gray-700 min-h-[400px]">
                        <div class="flex flex-col sm:flex-row justify-between sm:items-center p-4 border-b border-gray-700 shrink-0 gap-2">
                            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">User Accounts</h3>
                            <input type="text" id="admin-users-search" placeholder="Search..." class="bg-gray-900 text-white px-3 py-1 rounded border border-gray-700 text-sm outline-none w-full sm:w-auto" oninput="window.filterAdminUsers(this.value)">
                        </div>
                        <div class="flex-1 overflow-y-auto p-2" id="admin-users-list">
                            <div class="text-center text-gray-500 p-8">Loading...</div>
                        </div>
                    </div>

                    ${r?`
                    <!-- Chats Section -->
                    <div class="bg-gray-800 rounded-xl flex flex-col shadow-lg border border-gray-700 min-h-[400px]">
                        <div class="flex flex-col sm:flex-row justify-between sm:items-center p-4 border-b border-gray-700 shrink-0 gap-2">
                            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest leading-tight">Global Chats & Channels</h3>
                            <input type="text" id="admin-chats-search" placeholder="Search..." class="bg-gray-900 text-white px-3 py-1 rounded border border-gray-700 text-sm outline-none w-full sm:w-auto" oninput="window.filterAdminChats(this.value)">
                        </div>
                        <div class="flex-1 overflow-y-auto p-2 min-h-0" id="admin-chats-list">
                            <div class="text-center text-gray-500 p-8">Loading...</div>
                        </div>
                    </div>`:""}

                    ${s?`
                    <!-- VIB Management Section -->
                    <div class="bg-gray-800 rounded-xl flex flex-col shadow-lg border border-gray-700 min-h-[400px] ${r?"lg:col-span-2":""}">
                        <div class="p-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
                            <h3 class="text-sm font-bold text-yellow-500 uppercase tracking-widest leading-tight">VIB Currency Management</h3>
                            <div class="flex flex-col sm:flex-row items-center gap-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-400 uppercase tracking-wider">Daily Bonus:</span>
                                    <input type="number" id="admin-weekly-vib" class="w-16 bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 text-sm outline-none font-mono">
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-400 uppercase tracking-wider">Prem 30d:</span>
                                    <input type="number" id="admin-prem-30" class="w-16 bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 text-sm outline-none font-mono">
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-400 uppercase tracking-wider">Prem Year:</span>
                                    <input type="number" id="admin-prem-365" class="w-16 bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 text-sm outline-none font-mono">
                                </div>
                                <button onclick="window.adminUpdateSettings()" class="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-colors border border-yellow-500/30">Save All</button>
                            </div>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar" id="admin-vib-transfers-list">
                             <div class="text-center text-gray-500 p-4">Loading real-time transfers...</div>
                        </div>
                    </div>`:""}
                </div>
            </div>
        </div>
    `,window._adminIsCreator=s,g()}let _=[];window.filterAdminUsers=s=>{const e=s.toLowerCase(),t=_.filter(r=>(r.display_name||"").toLowerCase().includes(e)||(r.username||"").toLowerCase().includes(e));A(t)};let f={reset_auth:!1,analytics:!1};async function g(){var s;try{const{data:e,error:t}=await o.from("profiles").select("*"),{data:r,error:n}=await o.from("chats").select("id, type, title, created_at, avatar_url, description");(t||n)&&console.warn("Some data could not be fetched due to RLS. Best effort displayed.");const a=e||[];_=a;const i=a.find(p=>{var I;return(I=p.settings)==null?void 0:I.is_tech_support});i&&((s=i.settings)!=null&&s.support_permissions)&&(f={...i.settings.support_permissions});const d=document.getElementById("ts-perm-reset"),l=document.getElementById("ts-perm-analytics");d&&(d.checked=f.reset_auth),l&&(l.checked=f.analytics);const u=r||[];x=u;const y=u.filter(p=>p.type==="private"&&p.description!=="TECH_SUPPORT_CHAT").length,v=u.filter(p=>p.type==="group").length,b=u.filter(p=>p.type==="channel").length,T=`
            <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center">
                <span class="text-3xl font-bold text-white">${a.length}</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider mt-1">Users</span>
            </div>
            <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center">
                <span class="text-3xl font-bold text-blue-400">${y}</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider mt-1">DM Chats</span>
            </div>
            <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center">
                <span class="text-3xl font-bold text-green-400">${v}</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider mt-1">Groups</span>
            </div>
            <div class="bg-gray-900 p-4 rounded-lg flex flex-col justify-center items-center">
                <span class="text-3xl font-bold text-orange-400">${b}</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider mt-1">Channels</span>
            </div>
        `,k=document.getElementById("admin-stats");k&&(k.innerHTML=T),A(a),P(u),window._adminIsCreator&&(S(),$())}catch(e){console.error("Admin Load Error:",e)}}let h=null;async function S(){try{const{data:s}=await o.from("admin_settings").select("value").eq("key","weekly_vib_bonus").single(),{data:e}=await o.from("admin_settings").select("value").eq("key","premium_30d_price").single(),{data:t}=await o.from("admin_settings").select("value").eq("key","premium_365d_price").single(),r=document.getElementById("admin-weekly-vib");r&&(r.value=(s==null?void 0:s.value)||"15");const n=document.getElementById("admin-prem-30");n&&(n.value=(e==null?void 0:e.value)||"50");const a=document.getElementById("admin-prem-365");a&&(a.value=(t==null?void 0:t.value)||"300")}catch(s){console.error(s)}}async function E(){try{const{data:s}=await o.from("vib_transfers").select("amount, created_at, message, sender:profiles!sender_id(display_name, username), receiver:profiles!receiver_id(display_name, username)").order("created_at",{ascending:!1}).limit(100),e=document.getElementById("admin-vib-transfers-list");if(!e)return;if(!s||s.length===0){e.innerHTML='<div class="text-center text-gray-500 p-4">No transfers yet.</div>';return}e.innerHTML=s.map(t=>{var r,n;return`
            <div class="bg-gray-900 p-3 rounded-xl mb-2 text-sm border border-gray-700">
                <div class="flex justify-between items-center text-gray-300">
                    <div class="truncate mr-2">
                        <strong class="text-blue-400">@${((r=t.sender)==null?void 0:r.username)||"Unknown"}</strong> 
                        → 
                        <strong class="text-purple-400">@${((n=t.receiver)==null?void 0:n.username)||"Unknown"}</strong>
                    </div>
                    <div class="font-bold text-green-400 shrink-0">+${t.amount} VIB</div>
                </div>
                ${t.message?`<div class="text-xs text-gray-400 mt-1 italic">"${t.message}"</div>`:""}
                <div class="text-[10px] text-gray-500 mt-1">${new Date(t.created_at).toLocaleString()}</div>
            </div>
        `}).join("")}catch(s){console.error(s);const e=document.getElementById("admin-vib-transfers-list");e&&(e.innerHTML='<div class="text-red-500">Failed to load VIB transfers. DB may need update.</div>')}}async function $(){E(),h&&o.removeChannel(h),h=o.channel("admin_vib_transfers").on("postgres_changes",{event:"INSERT",schema:"public",table:"vib_transfers"},()=>{E()}).subscribe()}window.adminUpdateSettings=async()=>{const s=document.getElementById("admin-weekly-vib").value,e=document.getElementById("admin-prem-30").value,t=document.getElementById("admin-prem-365").value;try{await Promise.all([o.from("admin_settings").upsert({key:"weekly_vib_bonus",value:s}),o.from("admin_settings").upsert({key:"premium_30d_price",value:e}),o.from("admin_settings").upsert({key:"premium_365d_price",value:t})]),alert("All settings updated successfully")}catch(r){console.error(r),alert("Failed to update settings")}};function A(s){var n,a;const e=document.getElementById("admin-users-list");if(!e)return;if(s.length===0){e.innerHTML='<div class="text-center text-gray-500 p-4">No Data (RLS?)</div>';return}const t=window._adminIsCreator,r=((a=(n=c.currentProfile)==null?void 0:n.settings)==null?void 0:a.support_permissions)||{};e.innerHTML=s.map(i=>{var b;const d=((b=i.settings)==null?void 0:b.is_tech_support)||!1;let l="";(t||r.reset_auth)&&(l+=`
                <button onclick="window.tsReset2FA('${i.id}')" class="px-2 py-1 bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 rounded text-xs font-medium uppercase tracking-wider border border-orange-500/30">2FA</button>
                <button onclick="window.tsResetPIN('${i.id}')" class="px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded text-xs font-medium uppercase tracking-wider border border-red-500/30">PIN</button>
            `),t&&(l+=`
                 <button onclick="window.adminIssueVib('${i.username}')" class="px-3 py-1 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 rounded text-xs font-medium uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1">➕ VIB</button>
                 <button onclick="window.adminZeroVib('${i.username}')" class="px-3 py-1 bg-gray-500/20 text-gray-400 hover:bg-gray-500/40 rounded text-xs font-medium uppercase tracking-wider border border-gray-500/30 flex items-center gap-1">Cancel</button>
             `),(t||r.analytics)&&!d&&(l+=`
                <button onclick="window.adminForceLogin('${i.id}')" class="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded text-xs font-medium uppercase tracking-wider border border-blue-500/30">Sign In</button>
                <button onclick="window.adminDeleteUser('${i.id}')" class="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded text-xs font-medium uppercase tracking-wider border border-red-500/30">Delete</button>
            `);let u="";d&&(t?u=`<button onclick="window.adminRemoveTechSupport('${i.id}')" title="Убрать из тех. поддержки" class="px-2 py-0.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 hover:text-red-400 rounded text-[10px] font-bold uppercase border border-purple-500/30 hover:border-red-500/50 ml-2 transition-colors cursor-pointer">Support</button>`:u='<span class="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-bold uppercase border border-purple-500/30 ml-2">Support</span>');const y=i.is_premium&&(!i.premium_until||new Date(i.premium_until)>new Date),v=i.is_online;return`
        <div class="flex flex-col p-3 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-3 w-1/3 min-w-0 pr-4">
                    <div class="relative w-10 h-10 shrink-0">
                        <div class="w-full h-full rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-xl font-bold text-gray-300">
                            ${i.avatar_url?`<img src="${i.avatar_url}" class="w-full h-full object-cover">`:(i.display_name||i.username||"U")[0].toUpperCase()}
                        </div>
                        ${y?'<div class="absolute -top-1 -left-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm border border-gray-200 dark:border-gray-700 z-10 w-4 h-4 flex items-center justify-center"><img src="./image/Google-Gemini-Logo-Transparent.png" class="w-full h-full object-contain" alt="Premium"></div>':""}
                        ${v?'<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full z-40"></div>':""}
                    </div>
                    <div class="min-w-0 flex-1 flex flex-col justify-center">
                        <div class="text-white font-medium truncate flex items-center">${i.display_name||i.username||"User"}${u}</div>
                        <div class="text-xs text-gray-500 truncate">@${i.username}</div>
                    </div>
                </div>
                <div class="flex gap-1 shrink-0 flex-wrap justify-end">
                    ${l}
                </div>
            </div>
        </div>
        `}).join("")}function P(s){const e=document.getElementById("admin-chats-list");if(!e)return;if(s.length===0){e.innerHTML='<div class="text-center text-gray-500 p-4">No Data (RLS?)</div>';return}const t=s.filter(r=>r.type!=="private"&&r.type!=="direct");e.innerHTML=t.map(r=>`
        <div class="flex items-center justify-between p-3 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
            <div class="flex items-center gap-3 min-w-0 w-1/2">
                <div class="w-10 h-10 rounded-full bg-gray-700 shrink-0 overflow-hidden flex items-center justify-center text-xl font-bold text-gray-300">
                    ${r.avatar_url?`<img src="${r.avatar_url}" class="w-full h-full object-cover">`:(r.title||"U")[0].toUpperCase()}
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                    <div class="text-white font-medium truncate">${r.title||"Untitled"}</div>
                    <div class="text-xs ${r.type==="channel"?"text-orange-400":"text-green-400"} uppercase font-bold">${r.type}</div>
                </div>
            </div>
            <div class="flex gap-2 shrink-0">
                <button onclick="window.adminOpenChat('${r.id}')" class="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/40 rounded text-xs font-medium uppercase tracking-wider border border-green-500/30">Enter</button>
                <button onclick="window.adminDeleteChat('${r.id}')" class="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded text-xs font-medium uppercase tracking-wider border border-red-500/30 shrink-0">PURGE</button>
            </div>
        </div>
    `).join(""),t.length===0&&(e.innerHTML='<div class="text-center text-gray-500 p-4">No groups or channels</div>')}window.adminAddTechSupport=async()=>{const s=document.getElementById("ts-add-username"),e=s.value.trim().replace(/^@/,"");if(e)try{const{data:t}=await o.from("profiles").select("*").eq("username",e).single();if(t){const r=t.settings||{};r.is_tech_support=!0,r.support_permissions=f,await o.from("profiles").update({settings:r}).eq("id",t.id),s.value="",g()}else alert("User not found!")}catch(t){console.error(t),alert("Failed to add tech support.")}};window.adminSetGlobalTsPerm=async(s,e)=>{try{f[s]=e;const t=_.filter(r=>{var n;return(n=r.settings)==null?void 0:n.is_tech_support});for(const r of t){const n=r.settings||{};n.support_permissions={...f},await o.from("profiles").update({settings:n}).eq("id",r.id)}}catch(t){console.error(t),alert("Failed to update global tech support permission.")}};window.adminRemoveTechSupport=async s=>{if(confirm("Вы уверены, что хотите снять статус Технической Поддержки с этого пользователя?"))try{const{data:t}=await o.from("profiles").select("*").eq("id",s).single();if(t){const r=t.settings||{};r.is_tech_support=!1,await o.from("profiles").update({settings:r}).eq("id",s),g()}}catch(t){console.error(t),alert("Failed to remove tech support.")}};window.changeRootPassphrase=async()=>{m(()=>import("./index-DY5Edods.js").then(s=>s.u),__vite__mapDeps([0,1])).then(async s=>{if(!await s.customConfirm("Внимание! Вы собираетесь изменить ROOT пароль. Все старые сессии (которые полагались на старый пароль) потеряют доступ администратора. Вы уверены?"))return;const t=prompt("Введите новый пароль для ROOT DASHBOARD:");if(t&&t.trim().length>3){localStorage.setItem("root_passphrase",t.trim());try{const{data:r}=await o.from("profiles").select("id, settings");if(r){const n=r.map(a=>{const i=a.settings||{};return i.root_passphrase=t.trim(),i.support_permissions||(i.support_permissions={}),o.from("profiles").update({settings:i}).eq("id",a.id)});await Promise.all(n)}s.customAlert("ROOT пароль успешно изменен на всех аккаунтах!")}catch(r){console.error("Failed to sync root passphrase globally",r),s.customAlert("Пароль изменен локально, но не удалось синхронизировать глобально.")}}else s.customAlert("Пароль слишком короткий или не был введен.")})};window.tsReset2FA=async s=>{if(confirm("Отключить двухэтапную аутентификацию для этого пользователя?"))try{const{data:e}=await o.from("profiles").select("*").eq("id",s).single();if(e){const t={...e.settings,twoStepPasscode:null};await o.from("profiles").update({settings:t}).eq("id",s),m(()=>import("./index-DY5Edods.js").then(r=>r.u),__vite__mapDeps([0,1])).then(r=>r.customAlert("2FA успешно сброшена (отключена)."))}}catch{m(()=>import("./index-DY5Edods.js").then(t=>t.u),__vite__mapDeps([0,1])).then(t=>t.customAlert("Ошибка сброса 2FA"))}};window.tsResetPIN=async s=>{if(confirm("Сбросить PIN-код для этого пользователя? Это удалит запрос PIN-кода на его устройстве при следующем входе."))try{const{data:e}=await o.from("profiles").select("*").eq("id",s).single();if(e){const t={...e.settings,force_pin_reset:!0};await o.from("profiles").update({settings:t}).eq("id",s),m(()=>import("./index-DY5Edods.js").then(r=>r.u),__vite__mapDeps([0,1])).then(r=>r.customAlert("Флаг сброса PIN-кода установлен. PIN будет сброшен при следующем входе пользователя."))}}catch{m(()=>import("./index-DY5Edods.js").then(t=>t.u),__vite__mapDeps([0,1])).then(t=>t.customAlert("Ошибка сброса PIN"))}};window.adminForceLogin=async s=>{var e,t;if(confirm("Войти в этого пользователя?"))try{const{data:r}=await o.from("profiles").select("*").eq("id",s).single();if(r){window.originalAdminUser||(window.originalAdminUser={...c.currentUser},window.originalAdminProfile={...c.currentProfile}),c.currentUser={id:s,email:"simulated@admin.local"},c.currentProfile=r;const n=c.currentProfile,i=(n==null?void 0:n.is_premium)&&(!n.premium_until||new Date(n.premium_until)>new Date)?'<span class="inline-flex items-center justify-center ml-1 shrink-0" title="Vibegram Premium"><img src="./image/Google-Gemini-Logo-Transparent.png" class="w-3.5 h-3.5 object-contain" alt="Premium"></span>':"";document.getElementById("my-nickname").innerHTML=`<span class="flex items-center">${(n==null?void 0:n.display_name)||(n==null?void 0:n.username)||"User"}${i}</span>`;const d=document.getElementById("my-avatar");if(d){const l=r.avatar_url,u=r.display_name||r.username||"U";d.innerHTML=`${l?`<img src="${l}" class="w-full h-full object-cover rounded-full">`:u[0].toUpperCase()} <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></div>`}w(),m(()=>import("./index-DY5Edods.js").then(l=>l.b),__vite__mapDeps([0,1])).then(l=>{l.closeChat(),l.loadChats()}),(e=document.getElementById("admin-incognito-banner"))==null||e.classList.add("hidden"),(t=document.getElementById("admin-impersonate-banner"))==null||t.classList.remove("hidden"),c.isAdminStatus=!1}}catch{alert("Simulated Login Failed")}};window.exitImpersonation=()=>{var s;if(window.originalAdminUser){c.currentUser={...window.originalAdminUser},c.currentProfile={...window.originalAdminProfile};const e=c.currentProfile,r=(e==null?void 0:e.is_premium)&&(!e.premium_until||new Date(e.premium_until)>new Date)?'<span class="inline-flex items-center justify-center ml-1 shrink-0" title="Vibegram Premium"><img src="./image/Google-Gemini-Logo-Transparent.png" class="w-3.5 h-3.5 object-contain" alt="Premium"></span>':"";document.getElementById("my-nickname").innerHTML=`<span class="flex items-center">${(e==null?void 0:e.display_name)||(e==null?void 0:e.username)||"User"}${r}</span>`;const n=document.getElementById("my-avatar");if(n){const a=e.avatar_url,i=e.display_name||e.username||"U";n.innerHTML=`${a?`<img src="${a}" class="w-full h-full object-cover rounded-full">`:i[0].toUpperCase()} <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></div>`}window.originalAdminUser=null,window.originalAdminProfile=null,(s=document.getElementById("admin-impersonate-banner"))==null||s.classList.add("hidden"),m(()=>import("./index-DY5Edods.js").then(a=>a.b),__vite__mapDeps([0,1])).then(a=>{a.closeChat(),a.loadChats()})}};window.adminDeleteUser=async s=>{var e;try{const{data:t}=await o.from("profiles").select("settings").eq("id",s).single();if((e=t==null?void 0:t.settings)!=null&&e.is_tech_support){m(()=>import("./index-DY5Edods.js").then(n=>n.u),__vite__mapDeps([0,1])).then(n=>n.showError("Удаление отклонено: Нельзя удалять пользователей тех. поддержки."));return}if(!confirm("Are you strictly sure? This deletes the user and cascades data."))return;const{error:r}=await o.from("profiles").delete().eq("id",s);if(r)throw r;g()}catch(t){alert("Force deletion error (might be restricted by RLS): "+t.message)}};window.adminDeleteChat=async s=>{if(confirm("PURGE this chat globally? Cannot be undone."))try{const{error:e}=await o.from("chats").delete().eq("id",s);if(e)throw e;g()}catch(e){alert("Chat purge error: "+e.message)}};window.adminOpenChat=async s=>{try{const e=x.find(t=>t.id===s);if(!e)return;m(()=>import("./index-DY5Edods.js").then(t=>t.b),__vite__mapDeps([0,1])).then(t=>{var n;c.isAdminStatus=!0;const r=[e.id,e.title||"Untitled",(e.title||"U")[0].toUpperCase(),e.type==="group"||e.type==="channel",e.type,[],e.avatar_url||void 0,e.description||void 0,!1];localStorage.setItem("incognito_chat_args",JSON.stringify(r)),(n=document.getElementById("admin-incognito-banner"))==null||n.classList.remove("hidden"),w(),t.openChat.apply(t,r)})}catch(e){console.error("Failed to open chat",e)}};window.closeIncognitoSession=()=>{var s;c.isAdminStatus=!1,localStorage.removeItem("incognito_chat_args"),(s=document.getElementById("admin-incognito-banner"))==null||s.classList.add("hidden"),m(()=>import("./index-DY5Edods.js").then(e=>e.b),__vite__mapDeps([0,1])).then(e=>{e.closeChat(),e.loadChats()})};window.adminIssueVib=async s=>{const e=prompt(`Укажите количество VIB для выдачи пользователю @${s}:`,"100");if(!e)return;const t=parseInt(e);if(isNaN(t)||t<=0){alert("Укажите корректную сумму.");return}try{const{data:r}=await o.from("profiles").select("id").eq("username",s).single();if(!r){alert("Пользователь не найден.");return}const{error:n}=await o.rpc("admin_grant_vib",{target_user_id:r.id,amount:t});if(n)throw n;const{customToast:a}=await m(async()=>{const{customToast:i}=await import("./index-DY5Edods.js").then(d=>d.u);return{customToast:i}},__vite__mapDeps([0,1]));a(`Пользователю @${s} успешно выдано ${t} VIB`),g()}catch(r){alert("Ошибка при выдаче VIB: "+r.message)}};window.adminZeroVib=async s=>{if(confirm(`Вы уверены, что хотите аннулировать баланс пользователя @${s}?`))try{const{data:t}=await o.from("profiles").select("id").eq("username",s).single();if(!t){alert("Пользователь не найден.");return}const{error:r}=await o.rpc("admin_zero_vib",{target_user_id:t.id});if(r)throw r;const{customToast:n}=await m(async()=>{const{customToast:a}=await import("./index-DY5Edods.js").then(i=>i.u);return{customToast:a}},__vite__mapDeps([0,1]));n(`Баланс пользователя @${s} успешно аннулирован.`),g()}catch(t){alert("Ошибка при аннулировании VIB: "+t.message)}};export{L as openAdminDashboard,U as promptCreatorAccess};
