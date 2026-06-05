import { useSupabase } from './hooks/useSupabase';
import { useUser } from './hooks/useUser';
import axios from "axios";
import { createClient,SupabaseClient } from '@supabase/supabase-js';
import {useState} from "react";


function App() {
  const [supabase,_setSupabase]=useState(createClient("https://ydhmphjngomaionfbmqu.supabase.co", "sb_publishable_v2bVeKRRgw0Xa-vhlSmZgQ_Be-qv9KA"))
  return <AppWrapper supabase={supabase}/>
}


function AppWrapper({supabase}:{supabase:SupabaseClient}) {
const {claims}=useUser(supabase);

 return <div> 
  {window.solflare &&!claims &&<button onClick={async ()=>{
    await supabase.auth.signInWithWeb3({
    chain: 'solana',
    statement: 'I confirm i want to sigin to prediction market',  
   wallet: window.solflare,
  });

 }}>
  Sign in with Solflare</button>}
  
  {!claims &&<button onClick={async ()=>{
    await supabase.auth.signInWithWeb3({
    chain: 'solana',
    statement: 'I confirm i want to sigin to prediction market',  
 //  wallet: window.phantom,
  });

 }}>
  Sign in with phantom</button>}

{claims && <button onClick={async ()=>{
  await supabase.auth.signOut();
}}>
  LOG out
  </button>
}
{JSON.stringify(claims)}
<button onClick={async ()=>{
  await supabase.auth.getSession().then(r=>{
    console.log(r.data.session.access_token);
  axios.post("http://localhost:3001/buy",{
  }, {
    headers: {
      Authorization: r.data.session.access_token
    }
  })
})
}}>Click here to buy</button>

</div>
}
export default App
