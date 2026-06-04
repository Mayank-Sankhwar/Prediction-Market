import { useSupabase } from './hooks/useSupabase';
import { useUser } from './hooks/useUser';


function App() {
const { claims } = useUser();
const supabase = useSupabase();
 return <div> 
  {!claims &&<button onClick={async ()=>{
    await supabase.auth.signInWithWeb3({
    chain: 'solana',
    statement: 'I confirm i want to sigin to prediction market',  
  });

 }}>
  Sign in with Solana</button>}


{claims && <button onClick={async ()=>{
  await supabase.auth.signOut();
}}>
  LOG out
  </button>
}
</div>
}
export default App
