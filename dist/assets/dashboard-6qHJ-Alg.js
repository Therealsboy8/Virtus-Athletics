import"./modulepreload-polyfill-B5Qt9EMX.js";import"./supabase-client-0eOI4Eft.js";import"./shopify-0dN3W67C.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";let c=null,s=[],d=[];async function h(){const t=Date.now();for(;!window.supabaseService.initialized;){if(Date.now()-t>5e3){console.error("Timeout waiting for Supabase initialization");break}await new Promise(e=>setTimeout(e,100))}if(!window.supabaseService.isAuthenticated()){window.location.href="auth.html?redirect=dashboard.html";return}if(!window.supabaseService.hasJoinedChallenge()){const e=await window.supabaseService.joinChallenge();if(e.error){console.error("Error joining challenge:",e.error),alert("Error joining challenge. Please try again.");return}}await p(),await b(),y(),f(),g(),w()}async function p(){s=await window.supabaseService.getProgress()}async function b(){d=await window.supabaseService.getWorkouts()}function y(){const r=window.supabaseService.participant,t=s.filter(n=>n.completed).length,e=Math.round(t/30*100);document.getElementById("currentDay").textContent=r.current_day,document.getElementById("completedDays").textContent=t,document.getElementById("completionRate").textContent=`${e}%`,document.getElementById("progressPercentage").textContent=`${e}%`,document.getElementById("progressBar").style.width=`${e}%`;let o="Start your journey today";t===0?o="Ready to start? Complete Day 1 now!":t<10?o="Great start! Keep building momentum.":t<20?o="You're in the zone! Don't stop now.":t<30?o="Almost there! Push through to the finish.":o="Congratulations! Challenge complete!",document.getElementById("progressMessage").textContent=o}function f(){const r=document.getElementById("calendarGrid"),t=window.supabaseService.participant;for(let e=1;e<=30;e++){const o=s.find(l=>l.day_number===e),n=(o==null?void 0:o.completed)||!1,i=e===t.current_day,a=document.createElement("div");a.className=`challenge-day rounded-lg p-4 text-center text-sm ${n?"completed":""} ${i?"current":""}`,a.innerHTML=`
                    <div class="font-bold">${e}</div>
                    <div class="text-xs mt-1">${n?"✓":i?"Today":""}</div>
                `,a.onclick=()=>x(e),r.appendChild(a)}}function g(){const t=window.supabaseService.participant.current_day,e=d.find(n=>n.day_number===t);if(!e||t>30){document.getElementById("todayWorkout").classList.add("hidden");return}c=e,document.getElementById("todayWorkout").classList.remove("hidden");const o=JSON.parse(e.exercises||"[]");document.getElementById("workoutDetails").innerHTML=`
                <h3 class="text-xl font-bold mb-2">Day ${e.day_number}: ${e.title}</h3>
                <p class="text-gray-400 mb-4">${e.description}</p>
                <div class="mb-4">
                    <span class="inline-block bg-yellow-600 text-black px-3 py-1 rounded-full text-xs font-semibold uppercase">${e.difficulty}</span>
                </div>
                <ul class="space-y-2">
                    ${o.map(n=>`<li class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>${n.name} - ${n.reps}</span>
                    </li>`).join("")}
                </ul>
            `}async function x(r){const t=d.find(a=>a.day_number===r),e=s.find(a=>a.day_number===r);if(!t)return;const o=JSON.parse(t.exercises||"[]"),n=e!=null&&e.completed?"Completed":"Not completed",i=`
Day ${t.day_number}: ${t.title}

Difficulty: ${t.difficulty}
Status: ${n}

${t.description}

Exercises:
${o.map(a=>`• ${a.name} - ${a.reps}`).join(`
`)}
            `;alert(i)}function w(){const r=document.getElementById("progressChart"),t=echarts.init(r),e=s.map((n,i)=>s.slice(0,i+1).filter(l=>l.completed).length),o={backgroundColor:"transparent",title:{text:"Daily Progress",textStyle:{color:"#ffffff",fontSize:18}},tooltip:{trigger:"axis",backgroundColor:"#1A1A1A",borderColor:"#8B6914",textStyle:{color:"#ffffff"}},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:Array.from({length:30},(n,i)=>`Day ${i+1}`),axisLine:{lineStyle:{color:"#2D2D2D"}},axisLabel:{color:"#9CA3AF",interval:4}},yAxis:{type:"value",max:30,axisLine:{lineStyle:{color:"#2D2D2D"}},axisLabel:{color:"#9CA3AF"},splitLine:{lineStyle:{color:"#2D2D2D"}}},series:[{name:"Completed Days",type:"line",data:e,lineStyle:{color:"#8B6914"},itemStyle:{color:"#8B6914"},areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:"rgba(139, 105, 20, 0.3)"},{offset:1,color:"rgba(139, 105, 20, 0.1)"}]}}}]};t.setOption(o),window.addEventListener("resize",()=>{t.resize()})}var u;(u=document.getElementById("completeWorkoutBtn"))==null||u.addEventListener("click",async function(){if(!c)return;if(this.disabled=!0,this.textContent="Marking as complete...",(await window.supabaseService.completeDay(c.day_number)).error){alert("Error completing workout. Please try again."),this.disabled=!1,this.textContent="Mark as Complete";return}alert("Workout completed! Great job!"),await p(),y(),f(),g(),w()});var m;(m=document.getElementById("signOutBtn"))==null||m.addEventListener("click",async()=>{await window.supabaseService.signOut(),window.location.href="index.html"});h();
